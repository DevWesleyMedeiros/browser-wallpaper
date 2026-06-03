const palco = document.getElementById('palco')
const numObjetos = document.getElementById('num_objetos')
const txtQtde = document.getElementById('txt_qtde')
const btnAdd = document.getElementById('btn_add')
const btnRemover = document.getElementById('btn_remover')
const btnToggleControles = document.getElementById('btn_toggle_controles')
const controles = document.getElementById('controles')
const txtVelocidade = document.getElementById('txt_velocidade')
const ckbTrails = document.getElementById('ckb_trails')
const txtTamanhoMin = document.getElementById('txt_tamanho_min')
const txtTamanhoMax = document.getElementById('txt_tamanho_max')

let larguraPalco = palco.offsetWidth
let alturaPalco = palco.offsetHeight

let bolas = []
let numBola = 0
let animationId = null
let showTrails = false

class Bola {
  constructor(arrayBolas, palco) {
    this.tamanhoMin = parseInt(txtTamanhoMin.value) || 10
    this.tamanhoMax = parseInt(txtTamanhoMax.value) || 25
    this.tamanho =
      Math.floor(Math.random() * (this.tamanhoMax - this.tamanhoMin + 1)) + this.tamanhoMin
    this.r = Math.floor(Math.random() * 255)
    this.g = Math.floor(Math.random() * 255)
    this.b = Math.floor(Math.random() * 255)
    this.posicaoX = Math.floor(Math.random() * (larguraPalco - this.tamanho))
    this.posicaoY = Math.floor(Math.random() * (alturaPalco - this.tamanho))
    this.velocidadeBase = parseFloat(txtVelocidade.value) || 1
    this.velocidadeX = Math.random() * this.velocidadeBase + 0.5
    this.velocidadeY = Math.random() * this.velocidadeBase + 0.5
    this.direcaoX = Math.random() > 0.5 ? 1 : -1
    this.direcaoY = Math.random() > 0.5 ? 1 : -1
    this.palco = palco
    this.arrayBolas = arrayBolas
    this.id = Date.now() + '_' + Math.floor(Math.random() * 100000000000)
    this.trail = []
    this.maxTrailLength = 10
    this.desenhar()
  }

  minhaPosicao() {
    return this.arrayBolas.indexOf(this)
  }

  remover() {
    if (this.eu) {
      this.eu.remove()
    }
    if (this.trailElements) {
      this.trailElements.forEach((el) => el.remove())
    }
  }

  desenhar() {
    const div = document.createElement('div')
    div.setAttribute('id', this.id)
    div.setAttribute('class', 'bola')
    div.setAttribute(
      'style',
      `left:${this.posicaoX}px; top:${this.posicaoY}px;width:${this.tamanho}px;height:${this.tamanho}px;background-color:rgb(${this.r}, ${this.g}, ${this.b});box-shadow: 0 0 ${this.tamanho / 2}px rgb(${this.r}, ${this.g}, ${this.b});`,
    )
    this.palco.appendChild(div)
    this.eu = document.getElementById(this.id)

    this.trailElements = []
    for (let i = 0; i < this.maxTrailLength; i++) {
      const trailDiv = document.createElement('div')
      trailDiv.setAttribute('class', 'bola-trail')
      trailDiv.style.width = `${this.tamanho}px`
      trailDiv.style.height = `${this.tamanho}px`
      trailDiv.style.backgroundColor = `rgb(${this.r}, ${this.g}, ${this.b})`
      trailDiv.style.opacity = 0
      this.palco.appendChild(trailDiv)
      this.trailElements.push(trailDiv)
    }
  }

  controleBordas() {
    if (this.posicaoX + this.tamanho >= larguraPalco) {
      this.direcaoX = -1
    } else if (this.posicaoX <= 0) {
      this.direcaoX = 1
    }
    if (this.posicaoY + this.tamanho >= alturaPalco) {
      this.direcaoY = -1
    } else if (this.posicaoY <= 0) {
      this.direcaoY = 1
    }
  }

  atualizar() {
    this.controleBordas()

    this.trail.unshift({ x: this.posicaoX, y: this.posicaoY })
    if (this.trail.length > this.maxTrailLength) {
      this.trail.pop()
    }

    this.posicaoX += this.direcaoX * this.velocidadeX
    this.posicaoY += this.direcaoY * this.velocidadeY

    this.eu.style.left = `${this.posicaoX}px`
    this.eu.style.top = `${this.posicaoY}px`

    if (showTrails) {
      this.trail.forEach((pos, index) => {
        if (this.trailElements[index]) {
          this.trailElements[index].style.left = `${pos.x}px`
          this.trailElements[index].style.top = `${pos.y}px`
          this.trailElements[index].style.opacity =
            ((this.maxTrailLength - index) / this.maxTrailLength) * 0.5
          this.trailElements[index].style.width =
            `${this.tamanho * (1 - index / this.maxTrailLength)}px`
          this.trailElements[index].style.height =
            `${this.tamanho * (1 - index / this.maxTrailLength)}px`
        }
      })
    } else {
      this.trailElements.forEach((el) => (el.style.opacity = 0))
    }
  }
}

function animate() {
  bolas.forEach((bola) => bola.atualizar())
  animationId = requestAnimationFrame(animate)
}

function iniciarAnimacao() {
  if (!animationId) {
    animate()
  }
}

window.addEventListener('resize', () => {
  larguraPalco = palco.offsetWidth
  alturaPalco = palco.offsetHeight
})

btnAdd.addEventListener('click', () => {
  let qtde = parseInt(txtQtde.value) || 0
  for (let i = 0; i < qtde; i++) {
    bolas.push(new Bola(bolas, palco))
    numBola++
  }
  numObjetos.innerHTML = numBola
  iniciarAnimacao()
})

btnRemover.addEventListener('click', () => {
  bolas.forEach((bola) => bola.remover())
  bolas = []
  numBola = 0
  numObjetos.innerHTML = numBola
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
})

btnToggleControles.addEventListener('click', () => {
  controles.classList.toggle('hidden')
})

ckbTrails.addEventListener('change', (e) => {
  showTrails = e.target.checked
})
