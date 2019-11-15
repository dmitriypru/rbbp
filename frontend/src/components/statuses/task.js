import React, { Component } from "react";
import '../board/board.css';

class Task extends Component {
    render() {
        if (this.props.state == 'up'){
        return (
            <div class='task_up'>
                <h3 class="h">{this.props.name}</h3>
                <h4 class="h">Flags: {this.props.flags} <br/> Uptime: {this.props.uptime}</h4>
            </div>
        )}
        if (this.props.state == 'mumble'){
            return (
                <div class='task_mumble'>
                    <h3 class="h">{this.props.name}</h3>
                    <h4 class="h">Flags: {this.props.flags} <br/> Uptime: {this.props.uptime}</h4>
                </div>
            )}
        if (this.props.state == 'corrupt'){
            return (
                <div class='task_corrupt'>
                    <h3 class="h">{this.props.name}</h3>
                    <h4 class="h">Flags: {this.props.flags} <br/> Uptime: {this.props.uptime}</h4>
                </div>
            )}
        if (this.props.state == 'down'){
                return (
                    <div class='task_down'>
                        <h3 class="h">{this.props.name}</h3>
                        <h4 class="h">Flags: {this.props.flags} <br/> Uptime: {this.props.uptime}</h4>
                    </div>
                )}
        
}
}
export default Task;