#!/bin/bash
cd /var/www/money-mate-backend
git pull origin main
npm install --force
pm2 restart 10
pm2 save