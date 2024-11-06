<template>
    <div class="background-container">
      <div class="content">
        <h1>Bem-vindo ao Meu Site</h1>
        <p>Este é um exemplo de página com uma imagem de fundo opacitada sobre um fundo preto.</p>
      </div>
    </div>
  </template>
  
  <style scoped>
  .background-container {
    /* Define o fundo preto */
    background-color: #000;
    
    /* Define a imagem de background */
    background-image: url('~/assets/background.jpg'); /* Substitua pelo caminho da sua imagem */
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  
    /* Configura a opacidade e tamanho */
    position: relative;
    height: 100vh;
    width: 100%;
  }
  
  .background-container::before {
    /* Elemento overlay para opacidade */
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* Fundo preto semi-transparente */
  }
  
  .content {
    position: relative;
    color: #fff;
    z-index: 1;
    text-align: center;
    padding: 20px;
  }
  </style>
  