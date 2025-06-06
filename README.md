# Content Organization System

A web application that extracts and organizes table of contents from books using OCR (Optical Character Recognition). The application provides an intuitive interface for uploading images of book indexes and converts them into a well-formatted, interactive digital format.

## Features

- **OCR Processing**: Extracts text from images of book indexes
- **Interactive Visualization**: Shows detected text regions with bounding boxes
- **Confidence Scores**: Displays OCR confidence levels for each detected text
- **Formatted Output**: Presents the index in a clean, organized format
- **Real-time Preview**: Live preview of detected text and formatting
- **Responsive Design**: Works well on different screen sizes

## Screenshots

Here are some screenshots of the application in action:

*Image 1: The main upload interface for submitting documents*
![Upload Interface](./screenshots/upload-interface.png)

*Image 2: Results page showing the detected text with bounding boxes*
![Results View](./screenshots/results-view.png)

*Image 3: OCR detecting and highlighting table of contents sections*
![Book Index Detection](./screenshots/book-index-detection.png)

## Tech Stack

### Backend
<p align="left">
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/Surya%20OCR-4B32C3?style=for-the-badge" alt="Surya OCR" />
  <img src="https://img.shields.io/badge/Flask--CORS-5A9FD4?style=for-the-badge" alt="Flask-CORS" />
  <img src="https://img.shields.io/badge/Pillow-8BC0D0?style=for-the-badge&logo=python&logoColor=white" alt="Pillow" />
</p>

### Frontend
<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge" alt="Recharts" />
  <img src="https://img.shields.io/badge/Lucide_React-5E5CE6?style=for-the-badge" alt="Lucide React" />
</p>

## Prerequisites

Make sure you have the following installed:
- Python 3.8 or higher
- Node.js 14 or higher
- npm (Node Package Manager)
- Git

## Installation

### Option 1: Using Setup Script (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/venkapk/Content-Organization-System.git
cd Content-Organization-System
```

2. Make the setup script executable:
```bash
chmod +x setup.sh
```

3. Run the setup script:
```bash
./setup.sh
```

The script will:
- Set up Python virtual environment
- Install backend dependencies
- Install frontend dependencies
- Launch both servers

### Option 2: Manual Setup

If the setup script doesn't work, you can set up the project manually:

1. Set up the backend:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

2. Set up the frontend:
```bash
cd frontend
npm install
```

3. Start the backend server:
```bash
# In the backend directory with venv activated
python app.py
```

4. Start the frontend development server:
```bash
# In the frontend directory
npm run dev
```

## Usage

1. Access the application at `http://localhost:5173`
2. Click on the upload area or drag and drop an image of a book's table of contents
3. Click "Extract Index" to process the image
4. View the results:
   - Interactive visualization of detected text regions
   - Formatted table of contents with page numbers
   - Hover over items to see confidence scores

## Project Structure

```
Content-Organization-System/
├── backend/
│   ├── app.py                 # Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── uploads/              # Temporary upload storage
│   ├── results/              # OCR results
│   └── static/               # Static files
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main application
│   ├── public/              # Public assets
│   └── package.json         # Node.js dependencies
├── screenshots/
├── setup.sh                 # Setup and launch script
└── README.md               # This file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **Flask Import Error**:
   If you see a Werkzeug import error, try:
   ```bash
   pip install flask==2.3.3 werkzeug==2.3.7
   ```

2. **npm Start Script Error**:
   If npm start fails, try:
   ```bash
   npm run dev
   ```

3. **Port Already in Use**:
   If port 3000 or 5000 is already in use, it will open another port for you in the terminal which you will have to click on to launch the window, but you can modify the ports in:
   - Frontend: `vite.config.js`
   - Backend: `app.py`

4. **CUDA OOM**
    If you are using CUDA and you get the out-of-memory error while using/testing this - this is normal! 
    Since this is a proof of concept we did not touch CUDA configs. This can just be resolved by killing the terminal and then restarting the app.

### Still Having Issues?

Check the following:
- Make sure all prerequisites are installed
- Verify that you're in the correct directory when running commands
- Check if ports 3000 and 5000 are available
- Look at the terminal output for specific error messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Surya OCR for text extraction capabilities
- React and Vite communities for excellent development tools
- All contributors who have helped improve this project