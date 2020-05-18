# Detenidxs Desaparecidxs a color 🇺🇾

![https://i.imgur.com/ckS4V07.jpg](https://i.imgur.com/ckS4V07.jpg)
![https://i.imgur.com/fEBVXug.jpg](https://i.imgur.com/fEBVXug.jpg)

## TL;DR

1. Puede verse el [album de las fotos a color de las 197 personas detenidas desaparecidas.](https://photos.app.goo.gl/fcFYtXymp1AY769B9)
1. O bien una comparativa entre la foto original y la de color en [esta carpeta de Drive.](https://drive.google.com/open?id=16sCjHrZ6648Z46Jmierp14BlaRgCps74)

## Sobre el proyecto

Este proyecto consta de tres partes:
1. el scrapper
1. la notebook para la colorización
1. las fichas de los detenidxs desaparecidxs

### Scrapper

- Un scrapper que descarga los PDFs de los detenidos desaparecidos disponibilizados en la
  página oficial de [Madres y Familiares de Uruguayos Detenidos Desaparecidos](https://desaparecidos.org.uy/desaparecidos/)
- Transformación de los PDFs descargados a imagen.
- Colorización básica por API de las imágenes.

### Colorizer

Para colorizar con mayor cantidad de factores de renderización, se utilizó la notebook original
[ofrecida por DeOldify](https://colab.research.google.com/github/jantic/DeOldify/blob/master/ImageColorizerColab.ipynb),
se la adaptó cosa de poder conectar directamente a la [carpeta de Drive donde se subieron todas las imágenes](https://colab.research.google.com/drive/1-BV3LHjy9nojFy1kJDPQ6pFRfc96cfVG?usp=sharing) generadas,
a partir de las cuales se crearon las distintas fotos de colores.

### Fichas en formato Markdown

Para la generación de las fichas se utilizó el documento "Investigación Histórica sobre Detenidos Desaparecidos"
 realizado por Presidencia, en específico [el tomo 2](http://archivo.presidencia.gub.uy/_web/noticias/2007/06/tomo2.pdf)
 y [el tomo 3.](http://archivo.presidencia.gub.uy/_web/noticias/2007/06/tomo3.pdf)

Dichos tomos fueron pasados a Markdown con [esta herramienta online](https://pdf2md.morethan.io/)
y el contenido generado se descargó al archivo unificado `assets/files.md`, el cual fue separado en
las distintas fichas individuales con un poco de reemplazo con expresiones regulares.
