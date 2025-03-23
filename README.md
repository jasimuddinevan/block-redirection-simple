# Block Redirection Simple

A lightweight Chrome extension that helps you block unwanted URL redirections with a simple toggle switch.

## Features

- Simple on/off toggle for redirect blocking
- Add specific websites to your blocking list
- Block all types of HTTP redirects (301, 302, 303, 307, 308)
- Clean and intuitive user interface
- No data collection or tracking

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in your Chrome toolbar to open the popup interface
2. Toggle the switch to enable/disable redirect blocking
3. Add websites to block:
   - Enter the website URL in the input field
   - Click the "Add" button to add it to your blocking list
4. Remove websites from the blocking list:
   - Click the red delete button next to the website URL

## How It Works

The extension uses Chrome's declarativeNetRequest API to intercept and block redirect attempts from specified websites. When enabled, it will:

- Monitor HTTP response headers for redirect status codes
- Block redirections from websites in your blocking list
- Prevent automatic redirections while maintaining the original page

## Troubleshooting

- If blocking doesn't work immediately after adding a website, try toggling the switch off and on
- Make sure the website URL is entered correctly (e.g., "example.com" without "http://" or "www")
- Check if you have granted the necessary permissions to the extension

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## Support

If you find this extension helpful, you can:
- Star this repository
- [Buy me a coffee](https://buymeacoffee.com/jasimuddin)
- Follow me on [Facebook](https://www.facebook.com/jasimuddinevan)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Developed by Jasim Uddin
