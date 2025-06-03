## 🚀 Getting Started

This project requires [FFmpeg](https://ffmpeg.org/) and [n8n](https://n8n.io/) to be installed and properly configured in your development environment.

---

### 🔧 Install FFmpeg

#### Ubuntu / Debian

```bash
sudo apt update
sudo apt install ffmpeg
```

#### macOS (using Homebrew)

If you don’t have Homebrew installed:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then install FFmpeg:

```bash
brew install ffmpeg
```

#### Windows

**Option 1 (Recommended - Chocolatey):**

```bash
choco install ffmpeg
```

**Option 2 (Manual Installation):**

- Download the latest version from: [https://www.gyan.dev/ffmpeg/builds/](https://www.gyan.dev/ffmpeg/builds/)
- Extract the archive
- Add the `bin` directory to your system's `PATH`

---

### 🛠 Install n8n (Workflow Automation Tool)

#### Option 1: Install via npm (macOS / Linux / Windows with Node.js)

```bash
npm install -g n8n
```

Start n8n:

```bash
n8n
```

> ✅ By default, n8n will run at [http://localhost:5678](http://localhost:5678)

#### Option 2: Run with Docker (alternative, isolated setup)

```bash
docker run -it --rm \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

> 💡 You may need to create a `.env` file or pass environment variables for production use. For local testing, the default setup is sufficient.

---

### 📦 Environment Setup

Create a `.env` file in the root of the project with the following variables:

```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-domain.com/webhook/your-webhook-id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
NEXT_PUBLIC_BASE_URL=http://localhost:3000/
GOOGLE_CLIENT_SECRET=your-google-client-secret
SESSION_PASSWORD=your-random-uuid
```

> 💡 Replace the placeholder values with your actual credentials. For local development, the provided URLs can be used as-is.

---

### ▶️ Running the Application

1. **Start the Next.js Development Server**

```bash
npm run dev
```

2. **Start n8n in a Separate Terminal**

```bash
n8n start
```

3. **Import the Workflow**

In your local n8n instance:

- Open [http://localhost:5678](http://localhost:5678)
- Import the `Promptgorillas_assignment.json` file included in this project

4. **Open the App**

Open your browser at:

[http://localhost:3000](http://localhost:3000)
