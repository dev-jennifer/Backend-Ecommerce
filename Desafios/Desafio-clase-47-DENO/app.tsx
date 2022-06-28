import { React } from "./deps.ts";


function App() {
  return (
    <div>
      <div className="jumbotron jumbotron-fluid">
        
        <div className="container">
          <h1 className="display-4">Choose a color</h1>
 
          <form action="" method="post" encType="multipart/form-data">
            <label htmlFor="color">Choose a color:</label>
            <select id="color" name="colorList">
              <option value="blue">Blue</option>
              <option value="red">Red</option>
              <option value="yellow">Yellow</option>
              <option value="orange">Orange</option>
            </select>

            <input type="submit"/>
          </form>
        </div>
      </div>
    </div>
  );
}


export default App;