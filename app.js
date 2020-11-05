document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');

    let doodlerLeftSpace = 50; //variable to manipulate how far the doodler moves
    let startPoint = 150
    let doodlerBottomSpace = startPoint;
    let isGameOver = false;
    let platformCount = 5//how much space each platform will have bewteen each other
    let platforms = []
    let upTimerId
    let downTimerId
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId
    let rightTimerId
    let score = 0
    
    console.log(platforms)
    //creating doodler
    function createDoodler() {
        grid.appendChild(doodler);//added within the grid div in html
        doodler.classList.add('doodler')//added the doodler style from css
        doodlerLeftSpace = platforms[0].left //making sure doodler start on the first platofrm
        //styling doodler
        doodler.style.left = doodlerLeftSpace + 'px';
        doodler.style.bottom = doodlerBottomSpace + 'px';

    }

    class Platform {
        constructor(newPlatformBottom){
            this.bottom = newPlatformBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual);
        }
    }

    function createPlatforms() {
        for (let i = 0; i < platformCount; i++){
            let platformGap = 600 / platformCount; //we looked at the height of our grid in css and divide by paltformcount
            let newPlatformBottom = 100 + i * platformGap;
            let newPlatform = new Platform(newPlatformBottom);
            platforms.push(newPlatform)
        }
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px' //making sure it moves by 4px each time

                //modifying platforms
                if(platform.bottom < 100) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform');
                    platforms.shift()
                    score ++ //adds a score once platform is gone
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function () {
            doodlerBottomSpace += 20;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace > startPoint + 200) {
                fall()
            }
        }, 30)
    }

    function fall() {
        clearInterval(upTimerId);
        isJumping = false
        downTimerId = setInterval( function () {
            doodlerBottomSpace -= 5;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace <= 0){
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >=  platform.bottom) && 
                    (doodlerBottomSpace <=  platform.bottom + 15) &&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85))&&
                    !isJumping
                ){
                    console.log('landed');
                    startPoint = doodlerBottomSpace
                    jump()
                }
            })

        }, 30)
    }

    function gameOver(){
        console.log('game over');
        isGameOver = true;
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        //clears any glitching and keeps the doddler from moving once game is over
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function control(e) {
        if(e.key === 'ArrowLeft') {
            moveLeft();
        } else if (e.key === 'ArrowRight') {
            moveRight();
        } else if (e.key === 'ArrowUp'){
            moveStraight();
        }
    }

    function moveLeft() {
        if(isGoingRight){
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true;
        leftTimerId = setInterval(function() {
            //making sure it stays within the grid
            if (doodlerLeftSpace >= 0){
                doodlerLeftSpace -= 5;
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveRight();
            
        }, 20)
    }

    function moveRight() {
        if(isGoingLeft){
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true;
        rightTimerId = setInterval(function() {
            if (doodlerLeftSpace <= 340) {
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveLeft()
        }, 20)
    }

    function moveStraight() {
        isGoingRight = false;
        isGoingLeft = false;
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
    }

    function start() {
        if (!isGameOver) {
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms, 30) //platforms are moving down by 4px automatically
            jump();
            document.addEventListener('keyup', control)
        }
    }
    //attach to a btton
    start(); 
})

