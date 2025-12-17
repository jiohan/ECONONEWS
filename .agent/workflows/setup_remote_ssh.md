---
description: How to connect VS Code to a remote Ubuntu server and set up Docker
---
# VS Code Remote SSH & Docker Setup Guide

이 가이드는 현재 Windows 환경에서 작업 중인 VS Code를 Ubuntu 서버에 연결하고, Docker 환경을 구축하는 방법을 설명합니다.

## 1. VS Code 확장 프로그램 설치
1. VS Code 좌측 사이드바의 **Extensions** 아이콘(블록 모양) 클릭.
2. 검색창에 `Remote - SSH` 입력.
3. Microsoft에서 제작한 **Remote - SSH** 확장을 설치 (`Install` 버튼 클릭).

## 2. SSH 구성 파일 설정
1. `F1` 키를 눌러 명령어 팔레트를 엽니다.
2. `Remote-SSH: Open Configuration File...` 입력 후 선택.
3. 첫 번째 항목(`C:\Users\사용자명\.ssh\config`)을 선택.
4. 아래 내용을 서버 정보에 맞게 수정하여 붙여넣고 저장:

```ssh
Host my-ubuntu-server
    HostName <서버_IP_주소>
    User <우분투_사용자명>
    # IdentityFile C:\Users\내PC\.ssh\id_rsa  <-- SSH 키를 사용하는 경우 경로 지정
```

## 3. 서버 연결
1. VS Code 좌측 하단의 초록색 아이콘(`><`) 클릭.
2. **Connect to Host...** 선택.
3. 방금 설정한 `my-ubuntu-server` 클릭.
4. 새 창이 열리며 비밀번호를 물어보면 입력합니다.
5. 연결이 완료되면 좌측 하단에 `SSH: my-ubuntu-server`라고 표시됩니다.

## 4. [서버] Docker 설치 및 설정
(연결된 새 VS Code 창에서 터미널(`Ctrl + ` ` `)을 열고 아래 명령어 실행)

```bash
# 1. 필수 패키지 설치
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# 2. Docker GPG 키 추가
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 3. 레포지토리 설정
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Docker 설치
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. 권한 설정 (sudo 없이 docker 실행)
sudo usermod -aG docker $USER
# ⚠️ 중요: 로그아웃 후 다시 로그인해야 적용됨 (VS Code 창을 닫았다가 다시 연결)
```

## 5. 프로젝트 이동
1. 서버에 프로젝트 폴더 생성: `mkdir -p ~/projects/ai-news-backend`
2. 윈도우 탐색기에서 작업하던 파일을 드래그하여 VS Code 탐색기(Remote)로 복사하거나, Git을 통해 클론합니다.
   ```bash
   git clone https://github.com/YOUR_REPO/ai-news-backend.git ~/projects/ai-news-backend
   ```
3. VS Code에서 **File > Open Folder**를 눌러 서버의 프로젝트 폴더를 엽니다.

이제 저(AI)는 해당 서버 내에서 터미널과 파일을 직접 제어할 수 있게 됩니다.
