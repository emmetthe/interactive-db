# 🛠️ DB Schema Design - Dockerized Next.js App

---

### 🔨 Build a Docker Image

Build a Docker image using the `Dockerfile` in the current directory:

```bash
docker build -t your-image-name .
```

**Example:**
```bash
docker build -t db-design-app .
```

---

### 🔄 Rebuild the Image After Changes

If you've made changes to the Dockerfile or app code:

```bash
docker build -t your-image-name .
```

---

### 🛠️ Using Docker Compose

Build and start containers:

```bash
docker compose up --build
```

To start a container

```bash
docker compose up
```

Stop all running containers:

```bash
docker compose down
```
---

### 📋 Common Docker Commands

| Task                    | Command                             |
|-------------------------|-------------------------------------|
| List running containers | `docker ps`                         |
| List all containers     | `docker ps -a`                      |
| List images             | `docker images`                     |
| View container logs     | `docker logs <container_id>`        |
| Open container shell    | `docker exec -it <container_id> sh`|

---

### 🧯 Clean Up

Remove unused data (containers, images, networks, etc.):

```bash
docker system prune
```
Prune Unused Containers and Images

```bash
docker system prune -a --volumes
```