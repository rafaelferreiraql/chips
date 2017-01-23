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
            select: 3, // Por enquanto só há um player
        };
        this.newTurn = this.newTurn.bind(this);
        this.select = this.select.bind(this);
    }

    newTurn() {
        this.setState({
            turn: this.state.turn+1
        });
    }

    select(id) {
        this.setState({
            select: id
        });
    }

    render() {
        return(
            h("g",{},[
                h(Player,{
                    select: this.props.select,
                    grid: this.props.grid,
                    update: this.select
                }),
                h("rect",{
                        x:0,y:0,
                        width:30,height:30,
                        fill:"green",
                        onClick:this.newTurn
                    }
                )
            ])
        )
    }
}

class Player extends preact.Component {
    constructor() {
        super();
    }

    render() {
        return h("g",{},this.props.grid.map((pos,i) => {
                return h(Chip,{
                    key: i+1,
                    id: i+1,
                    initialPosition: pos,
                    grid: this.props.grid,
                    update: this.props.update,
                    selected: (this.props.select === i+1),
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
            selected: false
        }
        this.select = this.select.bind(this);
    }

    select(id) {
        this.props.update(this.props.id); // HERE we change the select state in Combat
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
        })
        // Fires a shot, or a Shot component
    }
}
