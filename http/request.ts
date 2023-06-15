type Request = {
    headers: string[];
    method: string;
    statusCode?: string;
    statusMessage?: string;
    path: string;
    url: string;
    params?: object;
    body?: object;
};

export default Request;

