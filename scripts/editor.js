let canvasEl = document.querySelector('#canvas');
let ctx = canvasEl.getContext('2d');

let limite = 130; /*para reduzir o tamanho do canvas*/

let width = $(window).width(), height = $(window).height() - limite;

canvasEl.width = width;
canvasEl.height = height;

let $controles = $('#controles');

/**
 * quantidade de oitavas
 * */
let oitava = 2; 

/**
 * alcance máximo de notas com base na quantidade de oitavas
 * */
let alcanceNotas = oitava * 7; 

/**
 * quantas barras de batidas serão renderizadas
 * */
let comprimento = 4; 

/**
 * quantidade da mesma nota em uma linha
 * */
let notas = comprimento * 4; 

let linhas = height / alcanceNotas;
let colunas = width / notas;

let cores = {
    fundo1: 'rgb(44, 44, 44)',
    fundo2: 'rgb(33, 33, 33)',
    nota: 'yellow'
};

let clickPos = null;

let tabela;

let escala = ['B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4', 'B3', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3'];

const synth = new Tone.Synth().toDestination();

let $botaoPlay = $('#play');

let $bpm = $('#bpm');
let $inputBpm = $('#inputbpm');
$inputBpm.val($bpm.val());

let bpm = $bpm.val();  
let tempo = Math.floor(1000 / (bpm / 60));

let timeout;

function start()
{
    tabela = inicializarTabela();
    desenhar();
}

function inicializarTabela()
{
    let arr = new Array(alcanceNotas);

    for(let i = 0; i < alcanceNotas; i++)
    {
        arr[i] = new Array(notas);

        for(let j = 0; j < notas; j++)
            arr[i][j] = 0;
    }

    return arr;
}

function desenhar()
{
    ctx.fillStyle = cores.fundo1;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = cores.fundo2;

    for(let i = 0; i < Math.floor(notas/8); i++)
    {
        ctx.fillRect(colunas * ((i + 1) * (4 + (i * 2))), 0, colunas * 4, height);
    }

    ctx.lineWidth = 3;

    for(let i = 0; i < alcanceNotas; i++)
    {
        let yPosition = linhas * (i + 1);

        ctx.beginPath();
        ctx.moveTo(0, yPosition);
        ctx.lineTo(width, yPosition);
        ctx.stroke();
    }
    
    for(let i = 0; i < notas; i++)
    {
        let xPosition = colunas * (i + 1);

        ctx.beginPath();
        ctx.moveTo(xPosition, 0);
        ctx.lineTo(xPosition, height);
        ctx.stroke();
    }
}

function redesenhar()
{
    ctx.clearRect(0, 0, width, height);
    desenhar();
    desenharNotas();
}

function adicionarNota(xCelula, yCelula)
{
    ctx.fillStyle = cores.nota;
    ctx.fillRect((xCelula * colunas) + 7, (yCelula*linhas) + 7, colunas - 14, linhas - 14);

    tabela[yCelula][xCelula] = 1;
}

function apagarNota(xCelula, yCelula)
{
    tabela[yCelula][xCelula] = 0;
    redesenhar();
}

function desenharNotas()
{
    for(let i = 0; i < alcanceNotas; i++)
    {
        for(let j = 0; j < notas; j++)
        {
            if(tabela[i][j] === 1)
            {
                adicionarNota(j, i);
            }
        }
    }
}

function tocarNota(linha)
{
    for(let i = 0; i < alcanceNotas; i++)
    {
        if(tabela[i][linha] == 1)
        {
            synth.triggerAttackRelease(escala[i], '8n');
        }
    }

    linha+=1;

    if(linha > notas - 1)
    {
        linha = 0;
    }

    timeout = setTimeout(() => {
        tocarNota(linha);
    }, tempo);
}

function pegarPosMouse(canvas, e)
{
    let rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

window.addEventListener('resize', e => {
    width = $(window).width();
    height = $(window).height() - limite;

    canvasEl.width = width;
    canvasEl.height = height;

    linhas = height / alcanceNotas;
    colunas = width / notas;

    $controles.height = ($(window).height - height);

    redesenhar();
});

canvasEl.addEventListener('click', e => {
    clickPos = pegarPosMouse(canvasEl, e);

    let xCelula = Math.floor((clickPos.x / colunas));
    let yCelula = Math.floor((clickPos.y / linhas));

    if(tabela[yCelula][xCelula] === 0)
    {
        adicionarNota(xCelula, yCelula);
        synth.triggerAttackRelease(escala[yCelula], '8n');
    }
    else
    {
        apagarNota(xCelula, yCelula);
    }
});

function play()
{
    tocarNota(0);
}

function stop()
{
    clearTimeout(timeout);
}

$botaoPlay.click(e => {
    if($botaoPlay.hasClass('playing') === false)
        play();
    else
        stop();

    $botaoPlay.toggleClass('playing');
});

$bpm.change(e => {
    bpm = $bpm.val();  
    $inputBpm.val(bpm);
    tempo = Math.floor(1000 / (bpm / 60));
});

start();