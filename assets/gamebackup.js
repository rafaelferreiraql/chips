const matchData = {
    turn: 0,
    p1score: 0,
    p2score: 0,
    p1shot: {
        type: "ice",
        lane: 3
    },
    p2shot: {
        type: "ice",
        lane: 3
    },
}

class Game extends preact.Component {
    render() {
        let grid = range(1,6).map((v,_,array) => {
            return (this.props.height/(array.length+1))*v;
        })

        // In this prototype we have only one combat screen
        return(
            h(Combat,{grid: grid})
        )
    }
}

class Combat extends preact.Component {
    constructor() {
        super();
        this.state = { // Variáveis do jogo
            turn: 0,
            p1selected: 3,
            // p1score: 0,
            // p2score: 0
        }
        this.newTurn = this.newTurn.bind(this)
    }

    newTurn() {
        this.setState({
            turn: this.state.turn+1
        })
    }

    render() {
        return(
            h(Player,{
                select: this.props.p1selected,
                grid: this.props.grid,
                update: this.newTurn
            })
        )
    }
}

class Player extends preact.Component {
    constructor() {
        super();
        this.state = {
            score: 0
        };
    }

    render() {
        return h("g",{},this.props.grid.map((pos,i) => {
                return h(Chip,{
                    initialPosition: pos,
                    grid: this.props.grid,
                    update: this.props.update,
                    selected: (this.props.select === i)
                })
            })
        );
        // returns five chips each side
        // (but in this first prototype only one side)
    }
}

class Chip extends preact.Component {
    constructor(props) {
        super(props);
        this.state = {
            pos: this.props.initialPosition,
            selected: false;
        }
        this.select = this.select.bind(this);
    }

    select() {
        this.props.update();
        console.log("Selected");
    }

    render() {
        const dim = 50;
        return h("rect",{
            width: dim, height: dim, // Dimensions
            x: 200, y: this.state.pos-dim/2, // Position
            onClick: this.select,
        })
        // Creates a chip, or a Chip component
    }
}

class Shot extends preact.Component {
    render() {
        const radius = 5;
        return h("circle",{
            r: radius,
            x:
        })
        // Fires a shot, or a Shot component
    }
}

{ // Players
    // (they must be different since they shoot to different sides and distinct controls,
    // so I chose class inheritance for that)
    class PlayerOne extends Player {

    }

    class PlayerTwo extends Player {

    }
}

{ // Types of shot (not in first prototype)
    class FireShot extends Shot {

    }

    class IceShot extends Shot {

    }

    class WaterShot extends Shot {

    }

    class LightShot extends Shot {

    }

    class ShadowShot extends Shot {

    }
}
