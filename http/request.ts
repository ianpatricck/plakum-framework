type Request = {
    headers: string[];
    method: string;
    statusCode?: string;
    statusMessage?: string;
    path: string;
    url: string;
    params?: any;
    body?: any;
}

export default Request;

