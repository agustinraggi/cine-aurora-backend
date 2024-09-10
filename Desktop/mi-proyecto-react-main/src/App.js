import { Component } from "react";

// aca ver que usaste asi la varible input y la palabra input es reservado por eso cambie la i por una I mayuscula
class Input extends Component {
  render() {
    return (
      <input 
        value={this.props.value}
        onChange={this.props.onChange}
      />
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: '',
      apellido: '',
    };
    
    // Asegurar que this está enlazado correctamente
    this.updateNombre = this.updateNombre.bind(this);
    this.updateApellido = this.updateApellido.bind(this); //aca falta para que salga en la consola que es el llamado del apellido
  }
  
  // aca cada vez que escribo una letra salga en la consola el nombre
  updateNombre(v) {
    console.log(this); 
    this.updateValues('nombre', v.target.value);
  }

  // aca cada vez que escribo una letra salga en la consola el apellido
  updateApellido(v) {
    console.log(this);  
    this.updateValues('apellido', v.target.value);
  }

  updateValues = (prop, value) => {
    this.setState({ [prop]: value });
  }

  render() {
    return (
      <p>
        Nombre completo: {`${this.state.nombre} ${this.state.apellido}`}
        <Input 
          value={this.state.nombre} 
          onChange={this.updateNombre}
        />
        <Input 
          value={this.state.apellido}
          onChange={this.updateApellido}
        />
      </p>
    );
  }
}

export default App;
