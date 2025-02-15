import { useEffect, useState } from "react";
import axios from "axios";

function fetchData(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const dataApi = async () => {
            try {
                const response = await axios.get(url);
                setData(response.data);
                setLoading(false)
            } catch (error) {
                setError(
                    error.response ? error.response.data.message : error.message
                );
            } 
        };
        dataApi()
    },
    
    []);
    return { data, loading, error };
}


export default fetchData;
