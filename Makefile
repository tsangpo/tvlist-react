
dev:
	npm run dev

deploy:
	npm run build
	# npx netlify login
	npx netlify deploy -p -s 17813e12-719f-40ac-87ba-9733a67b1a81 -d dist/
