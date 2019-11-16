import React, { Component } from "react";
import './board.css';
import Task from '../statuses/task';
//import Line from '../line/line'
//import { subscribeToTimer } from '../../service/api'

class board extends Component {
    constructor(props) {
        super(props);
            this.state = {
                team_attacker: 'team 1',
                team_defencer: 'team2',
                score: 0,
                tasks: [{ task_name: 'Task1', count_pf_flags: 2, status: 'up', sla: 2 }],
                round: 1,
                services: [],
                pos: -2.5,
                points_a: 0,
                points_b: 0,
            };
    };

    ws = new WebSocket('ws://192.168.99.100:8888')

    componentDidMount() {

        this.ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('connected')
            }
    
            this.ws.onmessage = evt => {
            // listen to data sent from the websocket server
            console.log(evt.data)
            const message = JSON.parse(evt.data)
            this.setState({team_attacker: message['team_attacker'], 
            team_defencer: message['team_defencer'], 
            score: message['score'], 
            tasks: message['tasks'], 
            round: message['round']})
            //Какая то херня с tasks
            console.log(this.state)
            }
    
            this.ws.onclose = () => {
            console.log('disconnected')
    
            }



        document.title = "Red-Blue battle";
        let ts = []
        var arr = this.state.tasks
        arr.forEach(element => {
            ts.push(<Task flags={element.count_of_flags} name={element.task_name} state={element.status} uptime={element.sla} />)
        });

        this.setState({ services: ts })
        this.setState({ pos: 0.092 * this.props.score + 43.5 })
        var a = 0
        var b = 0
        if (this.state.score > 0){
            a = this.state.score
        }
        else{
            b = -this.state.score
        }
        this.setState({points_a: a, points_b: b})
    }

    render() {
        return (
            <div class="main">
                <div class="left">
                    <div class="team">
                        <h1>Attackers: {this.state.team_attacker}</h1>

                    </div>

                </div>
                <div class="right">
                    <div class="team">
                        <h1>Defensers: {this.state.team_defencer}</h1>
                    </div>
                </div>

                <div class="score_left">
                    <h2 class='num_left'>{this.state.points_a}</h2>
                </div>
                <div class="score_right">
                    <h2 class='num_right'>{this.state.points_b}</h2>
                </div>
                <div class="round">
                    <h1>Round: {this.state.round}</h1>
                </div>

                <div class='tasks'>
                    {this.state.services}
                </div>


            </div>
        )
    }

}
export default board;
