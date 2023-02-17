import "./App.css";
import Router from "./routes";
import axios from "axios";

axios.interceptors.request.use((config) => {
    return config;
});
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (401 === error.response.status) {
            window.location.href =
                "/Identity/Account/Login?returnUrl=" + window.location.pathname;
        } else {
            return Promise.reject(error);
        }
    }
);

function App() {
    return (
        <div className="App">
            <Router />
        </div>
    );
}

export default App;
