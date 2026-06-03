const palco = document.getElementById('palco')
const numObjetos = document.getElementById('num_objetos')
const txtQtde = document.getElementById('txt_qtde')
const btnAdd = document.getElementById('btn_add')
const btnRemover = document.getElementById('btn_remover')


class Bola{
    constructor(arrayBolas, palco){
        this.tamanho = Math.floor(Math.random()*15)+10
        this.r = Math.floor(Math.random()*255)
        this.g = Math.floor(Math.random()*255)
        this.b = Math.floor(Math.random()*255)
        this.posicaoX = Math.floor(Math.random()*(larguraPalco - this.tamanho))
        this.posicaoY = Math.floor(Math.random()*(alturaPalco - this.tamanho))
        this.velocidadeX = Math.floor(Math.random()*2)+0.5
        this.velocidadeY = Math.floor(Math.random()*2)+0.5
        this.direcaoX = Math.floor(Math.random()*10) > 5? 1 : -1
        this.direcaoY = Math.floor(Math.random()*10) > 5? 1 : -1
        this.palco = palco
        this.arrayBolas = arrayBolas
        this.id = Date.now() +"_"+Math.floor(Math.random()*100000000000)
        this.desenhar()
        this.controle = setInterval(this.controlar, 10)
        this.eu = document.getElementById(this.id)
    }
    minhaPosicao = ()=>{
        return this.arrayBolas.indexOf(this)
    }
    remover = ()=>{
        clearInterval(this.controle)
        bolas = bolas.filter((bola)=>{
            if(bola.id != this.id){
                return bola
            }
        })
        this.eu.remove()
        numBola--
        numObjetos.innerHTML = numBola
    }
    desenhar = ()=>{
        const div = document.createElement("div")
        div.setAttribute("id", this.id)
        div.setAttribute("class", "bola")
        div.setAttribute("style", `left:${this.posicaoX}px; top:${this.posicaoY}px;width:${this.tamanho}px;height:${this.tamanho}px;background-color:rgb(${this.r}, ${this.g}, ${this.b});`)
        this.palco.appendChild(div)
    }
    controleBordas = ()=>{
        if(this.posicaoX + this.tamanho >= larguraPalco){
            this.direcaoX = -1
        }else if(this.posicaoX <= 0){
            this.direcaoX = 1
        }
        if(this.posicaoY + this.tamanho >= alturaPalco){
            this.direcaoY = -1
        }else if(this.posicaoY <= 0){
            this.direcaoY = 1
        }
    }
    controlar = ()=>{
        this.controleBordas()
        this.posicaoX += this.direcaoX * this.velocidadeX
        this.posicaoY += this.direcaoY * this.velocidadeY
        this.eu.setAttribute("style", `left:${this.posicaoX}px; top:${this.posicaoY}px;width:${this.tamanho}px;height:${this.tamanho}px;background-color:rgb(${this.r}, ${this.g}, ${this.b});`)
        if((this.posicaoX > larguraPalco)||(this.posicaoY > alturaPalco)){
            this.remover()
        }
    }
}

let larguraPalco = palco.offsetWidth
let alturaPalco = palco.offsetHeight

let bolas = []
let numBola = 0 

window.addEventListener("resize", ()=>{
    larguraPalco = palco.offsetWidth
    alturaPalco = palco.offsetHeight
})
btnAdd.addEventListener("click", ()=>{
    let qtde = txtQtde.value
    for(i = 0; i < qtde; i++){
        bolas.push(new Bola(bolas, palco))
    }
})

btnRemover.addEventListener("click", ()=>{
    bolas.map((bola)=>{
        bola.remover()
    })
})