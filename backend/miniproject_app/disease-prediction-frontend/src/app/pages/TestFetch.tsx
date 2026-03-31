export default function TestFetch() {
    return <button onClick={() => {
        const token = localStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/predict/', {
            method: 'POST',
            body: JSON.stringify({ "high_fever": 1 }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.json()).then(console.log).catch(console.error)
    }}>TEST FETCH GET</button>
}
