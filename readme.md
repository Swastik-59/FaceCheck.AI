# FaceCheck.AI 🤖

FaceCheck.AI is a full-stack AI-powered application that detects whether a face is **real** or **AI-generated** using a custom-trained Convolutional Neural Network (CNN) model. It comes with a sleek modern UI built with Next.js and a backend API using FastAPI.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework for production
- **TailwindCSS** - Utility-first CSS framework
- **Vercel** - Deployment platform for UI

### Backend
- **FastAPI** - Modern, fast Python web framework
- **Render** - Cloud platform for API deployment
- **REST API** - Clean API architecture

### ML/AI
- **TensorFlow/Keras** - Deep learning framework
- **Custom CNN** - Convolutional Neural Network architecture
- **180K+ face dataset** - Comprehensive training data

---

## 🚀 Features

- Upload or paste an image URL to classify faces as **REAL** or **FAKE**
- Custom-trained CNN model on 180,000+ face images
- Live probability confidence with detailed result breakdown
- Responsive and clean UI design using Tailwind CSS and Inter/Noto fonts
- Backend REST API using FastAPI deployed on Render with Docker
- Frontend deployed on Vercel
- Containerized deployment for consistent performance across environments

---

## 🐳 Docker Deployment

The backend API is containerized using Docker for consistent deployment on Render.

### Docker Configuration
```dockerfile
# Dockerfile example structure
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Deployment on Render
1. Connect your GitHub repository to Render
2. Select "Web Service" and choose Docker environment
3. Render automatically builds and deploys your containerized API
4. Environment variables can be configured in Render dashboard

---

## 🧠 Model Performance

Our custom-trained model demonstrates high accuracy and generalization performance.

### 📊 Evaluation Metrics

```text
Test Accuracy: 0.9165

Classification Report:
              precision    recall  f1-score   support
        Real       0.92      0.90      0.91      8124
        Fake       0.91      0.93      0.92      9424
    accuracy                           0.92     17548
   macro avg       0.92      0.92      0.92     17548
weighted avg       0.92      0.92      0.92     17548
```

### Accuracy & Loss Curves
<p align="center">
  <img src="./AI/assets/acc loss.png" width="600" alt="Accuracy and Loss">
</p>

### Confusion Matrix
<p align="center">
  <img src="./AI/assets/confusion matrix.png" width="600" alt="Confusion Matrix">
</p>

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- Docker (for containerized deployment)
- npm or yarn

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/Swastik-59/FaceCheck.AI.git
cd facecheck-ai

# Install dependencies
npm install

# Run development server
npm run dev
```

### Backend Setup

#### Local Development
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --reload
```

#### Docker Deployment
```bash
# Build Docker image
docker build -t facecheck-api .

# Run container
docker run -p 8000:8000 facecheck-api

# Or use docker-compose
docker-compose up --build
```

---

## Demo

https://github.com/user-attachments/assets/82edff4e-7e1e-4bf2-b7d4-03fe78c4d9e1

---
