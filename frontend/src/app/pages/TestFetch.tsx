import { API_BASE_URL } from '../utils/api';

export default function TestFetch() {
    return <button onClick={() => {
        const token = localStorage.getItem('access_token');
        fetch(`${API_BASE_URL}/api/predict/`, {
            method: 'POST',
            body: JSON.stringify({ "high_fever": 1 }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.json()).then(console.log).catch(console.error)
    }}>TEST FETCH GET</button>
}
