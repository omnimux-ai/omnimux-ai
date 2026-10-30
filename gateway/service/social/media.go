package social

import (
	"errors"
	"fmt"
	"net/url"
	"path"
	"strings"
)

// Allowed Zernio contentType values (from upstream validation error).
var allowedContentTypes = map[string]string{
	"image/jpeg":         "image",
	"image/jpg":          "image",
	"image/png":          "image",
	"image/webp":         "image",
	"image/gif":          "image",
	"video/mp4":          "video",
	"video/mpeg":         "video",
	"video/quicktime":    "video",
	"video/avi":          "video",
	"video/x-msvideo":    "video",
	"video/webm":         "video",
	"video/x-m4v":        "video",
	"application/pdf":    "document",
	"audio/mpeg":         "audio",
	"audio/mp4":          "audio",
	"audio/aac":          "audio",
	"audio/ogg":          "audio",
	"audio/wav":          "audio",
	"audio/x-wav":        "audio",
	"audio/webm":         "audio",
}

// PresignInput is the OmniMux-normalized media presign request.
type PresignInput struct {
	Filename    string
	ContentType string
	SizeBytes   int64
}

// NormalizePresignInput accepts OmniMux snake_case and legacy camelCase maps.
func NormalizePresignInput(body map[string]any) (PresignInput, error) {
	var in PresignInput
	if body == nil {
		return in, errors.New("filename and content_type are required")
	}
	in.Filename = firstString(body, "filename", "fileName", "file_name", "name")
	in.ContentType = firstString(body, "content_type", "contentType", "mimeType", "mime_type")
	in.SizeBytes = firstInt64(body, "size_bytes", "size", "fileSize", "file_size")

	in.Filename = path.Base(strings.TrimSpace(in.Filename))
	in.ContentType = strings.ToLower(strings.TrimSpace(in.ContentType))
	if in.Filename == "" || in.Filename == "." || in.Filename == "/" {
		return in, errors.New("filename is required")
	}
	if in.ContentType == "" {
		return in, errors.New("content_type is required")
	}
	if _, ok := allowedContentTypes[in.ContentType]; !ok {
		return in, fmt.Errorf("unsupported content_type: %s", in.ContentType)
	}
	return in, nil
}

// ZernioPresignBody maps OmniMux input to upstream POST /media/presign body.
func ZernioPresignBody(in PresignInput) map[string]any {
	return map[string]any{
		"filename":    in.Filename,
		"contentType": in.ContentType,
	}
}

// NormalizeMediaItems converts client media_items into Zernio mediaItems [{url,type?}].
func NormalizeMediaItems(raw []map[string]any, maxItems int) ([]map[string]any, error) {
	if len(raw) == 0 {
		return nil, nil
	}
	if maxItems > 0 && len(raw) > maxItems {
		return nil, fmt.Errorf("too many media_items: max %d", maxItems)
	}
	out := make([]map[string]any, 0, len(raw))
	for i, item := range raw {
		if item == nil {
			return nil, fmt.Errorf("media_items[%d] is empty", i)
		}
		u := firstString(item, "url", "public_url", "publicUrl", "mediaUrl", "media_url")
		u = strings.TrimSpace(u)
		if u == "" {
			return nil, fmt.Errorf("media_items[%d].url is required", i)
		}
		if _, err := url.ParseRequestURI(u); err != nil {
			return nil, fmt.Errorf("media_items[%d].url is invalid", i)
		}
		entry := map[string]any{"url": u}
		typ := firstString(item, "type", "media_type", "mediaType")
		typ = strings.ToLower(strings.TrimSpace(typ))
		if typ == "" {
			// Infer from URL extension when possible
			ext := strings.ToLower(path.Ext(u))
			switch ext {
			case ".mp4", ".mov", ".webm", ".m4v", ".avi", ".mpeg", ".mpg":
				typ = "video"
			case ".png", ".jpg", ".jpeg", ".gif", ".webp":
				typ = "image"
			case ".mp3", ".aac", ".wav", ".ogg", ".m4a":
				typ = "audio"
			case ".pdf":
				typ = "document"
			}
		}
		if typ != "" {
			entry["type"] = typ
		}
		out = append(out, entry)
	}
	return out, nil
}

func firstString(m map[string]any, keys ...string) string {
	for _, k := range keys {
		if v, ok := m[k]; ok && v != nil {
			switch t := v.(type) {
			case string:
				if strings.TrimSpace(t) != "" {
					return t
				}
			}
		}
	}
	return ""
}

func firstInt64(m map[string]any, keys ...string) int64 {
	for _, k := range keys {
		if v, ok := m[k]; ok && v != nil {
			switch t := v.(type) {
			case float64:
				return int64(t)
			case int64:
				return t
			case int:
				return int64(t)
			case int32:
				return int64(t)
			}
		}
	}
	return 0
}
