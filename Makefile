install:
	rm -rf .git;
	yarn;
	yarn first:start;
	git init;
	git add -A;
	git commit -m "Initial commit";