window.onload = function()
{
    let canvasWidth = 900;
    let canvasHeight = 600;
    let blockSize = 30;
    let ctx;
    let delay = 100;
    let snakee;
    let applee;
    //JAI RAJOUTE CI DESSOUS
    let widthInBlocks = canvasWidth/blockSize; //la largeur en terme de bloc
    let heightInBlocks = canvasHeight/blockSize; //la hauteur en terme de bloc
    //JUSQUICI
    init();
    
    function init()
    {
        let canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4], [5,4], [4,4],[3,4],[2,4]], "right");
        applee = new Apple([10,10]);
        refreshCanvas();
    }

    function refreshCanvas()
    {
        snakee.advance();
        if(snakee.checkCollision())
        {
            //GAME OVER
        }
        else
        {
            //Si le serpent mange la pomme
            if(snakee.isEatingApple(applee))
            {
                //Augmenter la taille du serpent
                snakee.ateApple = true;
                //Donner une nouvelle position à la pomme et vérifier qu'elle n'est pas sur le serpent
                do{
                    applee.setNewPosition();
                } while(applee.isOnSnake(snakee));

            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            snakee.draw();
            applee.draw();
            setTimeout(refreshCanvas, delay);
        }
        
    }
    function drawBlock(ctx, position)
    {
        let x = position[0] * blockSize;
        let y = position[1] * blockSize;
        ctx.fillRect(x,y, blockSize, blockSize);
    }

    function Snake(body, direction)
    {
        this.body = body;
        this.direction= direction;
        //Le serpent mange une pomme ou pas
        this.ateApple = false;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(let i=0; i < this.body.length; i++)
            {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance= () =>
        {
            let nextPosition = this.body[0].slice();
            switch(this.direction)
            {
                case "left":
                    nextPosition[0]--;
                    break;
                case "right":
                    nextPosition[0]++;
                    break;
                case "down":
                    nextPosition[1]++;
                    break;
                case "up":
                    nextPosition[1]--;
                    break;
                default:
                    throw("invalid direction");//throw permet d'afficher un message d'erreur
                    
            }
            this.body.unshift(nextPosition);
            //On n'augmente pas la taille du serpent si il n'a pas mangé de pomme
            if(!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;
        };
        this.setDirection = function(newDirection)
        {
            let allowedDirections;
            switch(this.direction)
            {
                case "left":
                case "right":
                    allowedDirections = ["up","down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["right","left"];
                    break;
                default:
                    throw ("invalid direction");//throw permet d'afficher un message d'erreur
            }
            if(allowedDirections.indexOf(newDirection)> -1) //si c'est suppérieur à -1 c'est forcément égal à 0 ou à 1, les 2 indices de allowDirection. l'action est donc permise, la directon devient la newDirection
            {
                this.direction = newDirection;
            }

        };
        this.checkCollision = () =>
        {
            let wallCollision = false;
            let snakeCollision = false;
            let head = this.body[0];// c'est la tete du serpent qui risque de prendre une collision
            let rest = this.body.slice(1);//le reste du corps du serpent
            let snakeX = head[0];
            let snakeY = head[1];
            let minX = 0;
            let minY = 0;
            let maxX = widthInBlocks - 1;
            let maxY = heightInBlocks - 1;
            let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;//verification que le serpent n'est pas sorti du cadre
            let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;//verification que le serpent n'est pas sorti du cadre

            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
                wallCollision = true;

            for(let i = 0; i< rest.length ;i++)
            {
                if(snakeX === rest[i][0] && snakeY === rest[i][1])
                    snakeCollision = true;
            }
            return wallCollision || snakeCollision;
        };
        //Fonction qui permet de détécter quand le serpent mange la pomme
        this.isEatingApple = (appleToEat) =>
        {
            let head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else
                return false;
        };


    }

    function Apple(position)
    {
        this.position=position;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#34C924";
            ctx.beginPath(); // JE NE CONNAIS PAS CA
            let radius = blockSize /2;// Pour dessiner le rayon du cercle qui representera la pomme
            let x = this.position[0]*blockSize + radius;
            let y = this.position[1]*blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true); //Fonction pour dessiner un cercle
            ctx.fill();
            ctx.restore();
        };
        //Fonction qui permet de donner une nouvelle position à la pomme
        this.setNewPosition = function()
        {
            let newX = Math.round(Math.random() * (widthInBlocks - 1));
            let newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        };
        //Fonction qui permet de vérifier si la pomme n'est pas sur le serpent au moment de sa création
        this.isOnSnake = (snakeToCheck) =>
        {
            let isOnSnake = false;
            for(let i = 0; i< snakeToCheck.body.length ;i++)
            {
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }

    document.onkeydown =  handleKeydown = e => // ecrit function handleKeydown(e), j'ai essayé de le faire en mode arrow
    {
        let key = e.keyCode;//keyCode est deprecié
        let newDirection;
        switch(key)
        {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            default:
                return;//en gros ne continue pas la fonction 
        }
        snakee.setDirection(newDirection);

    }

}