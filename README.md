This action scans the direction and sub directories for the file extensions you specify and output a JSON object listing the filepath, url, title and description

## Inputs

### `start-dir`

**Required** The top level directory to start the scan from.

### `base-url`

**Required** The base url of the site.

## Outputs

### `time`

The time the operation was carried out.

### `json`

The JSON object.

## Example usage

```yaml
uses: waleakomolafe/repo-2-json@v1.1
with:
  start-dir: "['**.{html,htm}', '!**/index.html', '!**/index.htm']"
  base-url: 'https://www.example.com/
```