import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        const userString = localStorage.getItem("@deskify:user");

        if(userString) {
            const user = JSON.parse(userString);
            setUserName(user.name);
        }
    }, []);

    function handleLogout() {
        localStorage.removeItem("@deskify:token");
        localStorage.removeItem("@deskify:user")
        navigate("/login");
    };

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Bem-vindo ao Dashboard, {userName}! 🚀</h1>
            <p>Você logou com sucesso e agora está na área logada.</p>
            
            <button 
                onClick={handleLogout}
                style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
            >
                Sair (Logout)
            </button>
        </div>
    );
}