import { useEffect, useState } from "react";
import apifetch from "../util/axios";

export function useFetch<T>(url : string) : [T | null, boolean, string | null, () => void] {
    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    async function refetch() {
        setError(null)
        setLoading(true)
        try {
            const feting = await apifetch(url)
            if(feting.status >= 400) {
                setError(feting.data.message)
                setLoading(false)
                return
            }
            setData(feting.data)
            setLoading(false)
        }catch(err) {
            setLoading(false)
            setError("Ada Masalah")
        }
    }

    useEffect(() => {
        refetch()
    }, [url])

    return [data, loading, error, refetch]
}