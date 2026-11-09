# TechNova Website

## Run locally

1. Install frontend dependencies with `npm install`.
2. Set up the Python backend once from the project root:

   ```powershell
   python -m venv backend\venv
   .\backend\venv\Scripts\python.exe -m pip install -r backend\requirements.txt
   ```

3. Start the API. From the project root:

   ```powershell
   .\backend\venv\Scripts\python.exe backend\app.py
   ```

   Or, if your terminal is already in the `backend` folder:

   ```powershell
   .\venv\Scripts\python.exe app.py
   ```

4. In a separate terminal at the project root, start the website with
   `npm run dev`.

Use the virtual-environment Python shown above rather than `python app.py`;
the latter may select a system Python that does not have the backend packages.

The chatbot and FAQ section have built-in responses and work without a Gemini
API key. To enable Gemini-generated responses, create `backend/.env` with:

```env
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=gemini-3.8-flash
```

The Vite development server proxies `/api` requests to the Flask API on
`127.0.0.1:5000`. In production, configure the web server to route `/api` to
the Flask backend.

## Checks

- `npm run lint`
- `npm run build`
