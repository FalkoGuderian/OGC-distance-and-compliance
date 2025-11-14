# OGC Distance Measurement and Compliance Check

A web-based tool for measuring distances to geographic features via OGC Web Feature Services (WFS) with AI-assisted support and automatic compliance checking.

## 🚀 Overview

This tool allows users to measure distances from a specific point to all features of a WFS layer within a defined search distance. User input is facilitated by AI support for natural language queries and automatic parameter extraction.

### AI Assistant
<img width="990" height="633" alt="image" src="https://github.com/user-attachments/assets/3bdf6bd0-37ad-4ab6-9292-69d0ad364d61" />

### Distance Measurement
<img width="991" height="748" alt="image" src="https://github.com/user-attachments/assets/afb444bd-5b6d-460e-9d27-cb1d775477b8" />

### Compliance Checking
<img width="992" height="826" alt="image" src="https://github.com/user-attachments/assets/c30e26b8-86aa-46ac-b1db-1b4a77a219b9" />


## ✨ Features

- **OGC WFS Integration**: Connection to various OGC WFS servers
- **Distance Measurement**: Automatic calculation of distances to features
- **AI Assistant**: Natural language parameter extraction using OpenRouter API
- **Compliance Checking**: Automatic evaluation against defined regulations
- **Interactive Map**: Visualization with Leaflet.js
- **Modular Architecture**: Easily extensible for additional OGC services

## 🏗️ Architecture

```
ogc-distance-measurement-tool/
├── index.html              # Main UI
├── src/
│   ├── main.js            # Main JavaScript logic
│   ├── DistanceCalculator.js # Distance calculation utilities
│   └── ai-prompts.js      # AI prompt templates and configuration
├── css/
│   └── styles.css         # Styles and Tailwind integration
├── config/
│   └── config.json        # Configuration, server URLs, layer maps
├── public/                # Static assets (currently empty)
├── LICENSE                # MIT License
├── README.md              # Documentation
├── SECURITY.md            # Security notes for API keys
├── THANKS.md             # Attribution and acknowledgments
├── package.json           # Dependencies and build scripts
├── package-lock.json      # Lockfile for exact dependency versions
├── vite.config.js         # Vite build configuration
├── .gitignore            # Git ignore files
└── todo.md               # Project todo list
```

## 🚀 Installation and Usage

### 1. Clone repository

```bash
git clone https://github.com/your-username/ogc-distance-measurement-tool.git
cd ogc-distance-measurement-tool
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

The server starts on `http://localhost:5173`.

### 4. Build for production

```bash
npm run build
```

The optimized version is created in the `dist/` folder.

## 🔧 Configuration

### Servers and Layers

Available servers and layers are configured in `config/config.json`. Currently supported servers:

- **BKG Administrative Areas** (`https://sgx.geodatenzentrum.de/wfs_vg250`)
  - Municipalities, districts, federal states, etc.
- **BfN Protected Areas** (`https://geodienste.bfn.de/ogc/wfs/schutzgebiet`)
  - Nature reserves, national parks, etc.
- **BKG Landscape Model DLM250 INSPIRE** (`https://sgx.geodatenzentrum.de/wfs_dlm250_inspire`)
  - Transport networks (roads, railways, air), hydrography, administrative units, protected sites

### AI Integration

An OpenRouter API key is required for AI functions. This is entered at runtime in the browser and not stored.

### Compliance Rules

Predefined check regulations are also defined in `config/config.json` and can be adjusted at runtime.

## 📚 API Examples

### WFS Query Example

```javascript
// Query all features within a BBOX
GET https://sgx.geodatenzentrum.de/wfs_vg250?
  service=WFS&
  version=2.0.0&
  request=GetFeature&
  typeNames=vg250:vg250_gem&
  bbox=13.0,50.0,14.0,51.0,EPSG:4326&
  outputFormat=application/json
```

### AI Prompt Example

```
You are an expert in GIS and OGC web services. Analyze the following user instruction and extract the required parameters for a WFS query.

User instruction: "Is the following object within 5000m distance to a nature reserve? {"type": "Point", "coordinates": [13.8713, 51.0036]}"

Available layers:
- Nature reserves (bfn_sch_Schutzgebiet:Naturschutzgebiete)
- Municipalities (vg250:vg250_gem)
// ... additional layers
```

## 🏗️ Development

### Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Tailwind CSS (CDN)
- **Maps**: Leaflet.js
- **Geospatial**: Turf.js
- **Build Tool**: Vite
- **AI**: OpenRouter API

### Extending with new servers

1. Add the server to `config/config.json`
2. Implement specific parsers for new GML formats if necessary
3. Test the integration

### New compliance rules

Compliance rules can be defined in `config/config.json`:

```json
{
  "id": "new-rule",
  "name": "Rule name",
  "description": "Description",
  "type": "distance",
  "minDistance": 500,
  "layerTypes": ["Layer type"]
}
```

## 🚀 Deployment

### GitHub Pages

1. Create build: `npm run build`
2. Deploy `dist/` folder to GitHub Pages

### Other hosting providers

The generated files in the `dist/` folder can be deployed to any static web hoster (Netlify, Vercel, etc.).

## 📋 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

Please read [SECURITY.md](SECURITY.md) for important notes on API keys and secure configuration.

## 🙏 Attribution

Thanks to all open-source projects and data providers that make this tool possible:

- [Leaflet](https://leafletjs.com/) - Interactive maps
- [Turf.js](https://turfjs.org/) - Geospatial analyses
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [OpenStreetMap](https://www.openstreetmap.org/) - Base map data
- [BfN](https://www.bfn.de/) - Protected areas Germany
- [BKG](https://www.geodatenzentrum.de/) - Administrative areas and landscape model data Germany

A complete list of all dependencies and data sources can be found in [THANKS.md](THANKS.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a pull request

## 📞 Contact

For questions and feedback, please create an issue or contact directly.

---

## 🔍 Troubleshooting

### Common Issues

**Problem**: Map does not load
**Solution**: Check internet connection and browser CORS settings.

**Problem**: API key error
**Solution**: Ensure the OpenRouter API key is valid and active.

**Problem**: No features found
**Solution**: Check server availability and BBOX parameters.

### Debug Modes

- Enable console outputs in browser developer tools
- Raw XML responses are displayed in the UI
