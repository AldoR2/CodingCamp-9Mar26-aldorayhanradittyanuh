# Technology Stack

## Core Technologies

- **HTML5**: Semantic markup, no frameworks
- **CSS3**: Vanilla CSS, no preprocessors or frameworks
- **JavaScript (ES6+)**: Vanilla JS, no libraries or frameworks
- **Local Storage API**: Browser-native data persistence

## Browser Support

- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## Build System

No build system required. This is a static web application that runs directly in the browser.

## Development Workflow

### Running the Application

Open `index.html` directly in a web browser. No server or build step required.

For development with live reload, you can use any static file server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000
```

### Testing

No automated test framework is currently configured. Testing is manual through browser interaction.

### Deployment

Deploy by hosting the three files (index.html, css/style.css, js/script.js) on any static web server or CDN.

## Common Commands

Since this is a static site with no build process, there are no build or test commands. Simply open `index.html` in a browser to run the application.
