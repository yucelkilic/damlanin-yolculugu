#!/bin/bash
set -euo pipefail

# Run from macOS Terminal, where GitHub login and network access are available.
cd "$(dirname "$0")/.."
command -v gh >/dev/null || { echo 'GitHub CLI gerekli: https://cli.github.com'; exit 1; }
command -v node >/dev/null || { echo 'Kontroller için Node.js gerekli: https://nodejs.org'; exit 1; }
npm run check

if ! gh auth status -h github.com >/dev/null 2>&1; then
  gh auth login -h github.com --web --git-protocol https
fi
gh auth setup-git
owner="$(gh api user --jq .login)"
repository="$owner/damlanin-yolculugu"
remote="https://github.com/$repository.git"

if [ ! -d .git ]; then
  git init -b main
fi
if [ "$(git branch --show-current)" != main ]; then
  echo 'Yayın main dalını kullanır. Önce main dalına geçin.'
  exit 1
fi
if git remote get-url origin >/dev/null 2>&1; then
  existing="$(git remote get-url origin)"
  if [ "$existing" != "$remote" ] && [ "$existing" != "git@github.com:$repository.git" ]; then
    echo "origin farklı bir depoya bağlı: $existing"
    echo 'Mevcut bağlantıyı korumak için işlem durduruldu.'
    exit 1
  fi
fi

git add index.html styles.css app.js assets sunum scripts .github .gitignore .nojekyll package.json README.md
if [ -f CNAME ]; then git add CNAME; fi
if ! git diff --cached --quiet; then
  git -c user.name="$owner" -c user.email="$owner@users.noreply.github.com" commit -m 'Damla’nın Yolculuğu sitesini yayınla'
fi

if ! gh repo view "$repository" >/dev/null 2>&1; then
  gh repo create "$repository" --public --description '4/A su tasarrufu ve yağmur suyu hasadı öğrenci projesi'
fi
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "$remote"
fi
git push -u origin main

if gh api "repos/$repository/pages" >/dev/null 2>&1; then
  gh api --method PUT "repos/$repository/pages" -f build_type=workflow >/dev/null
else
  gh api --method POST "repos/$repository/pages" -f build_type=workflow >/dev/null
fi

# A fresh repository may take a few seconds to register its workflow.
started=false
for attempt in 1 2 3 4 5; do
  if gh workflow run pages.yml --repo "$repository" --ref main; then
    started=true
    break
  fi
  sleep 3
done
if [ "$started" != true ]; then
  echo "İş akışını GitHub üzerinden başlatın: https://github.com/$repository/actions"
  exit 1
fi

echo "Yayın işlemi başlatıldı: https://github.com/$repository/actions"
echo "İşlem başarıyla tamamlandığında site adresi: https://$owner.github.io/damlanin-yolculugu/"
