Requirements
============

* docker
* git
* nodejs

Installation
============

1. `git clone <repo-url>`
1. `cd app`
1. `npm install`

Development
===========

Starting geoserver and database
---------------------cd----------
1. `cd docker`
2. `docker-compose up`

Starting app
------------
1. `cd app`
2. `npm start`


Geoserver
=========

1. visit http://localhost:8080/geoserver/web
2. login with `admin:geoserver`

Folder docker/geoserver/geoserver_data/data is for sharing data with geoserver

Git
===

If git add fails because of geoserver data directory:
`sudo chown -R xkuang:xkuang docker/geoserver/geoserver_data/`