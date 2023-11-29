defmodule LightningBugWeb.ApiController do
  use LightningBugWeb, :controller

  def get(conn, _params) do
    servers = Mdns.Client.devices()
    |> Map.get(:"lightning-bug.local")

    IO.inspect(Mdns.Client.devices())
    render(conn, :index, servers: servers)
  end

  def load(conn, _params) do
    service = LightningBug.CurrentService.get()
    ip = Tuple.to_list(service.ip)
    
    |> Enum.join(".")
    headers = [{"Content-type", "application/json"}]
    {:ok, %HTTPoison.Response{status_code: 200, body: body}} = HTTPoison.get("#{ip}", headers, [:timeout, 60000])
    loadedPixels = Poison.decode!(body)
    render(conn, :load, %{pixels: loadedPixels})
  end

  def set_service(conn, %{"ip" => ip}) do
    service = Mdns.Client.devices()
    |> Map.get(:"lightning-bug.local")
    |> Enum.find(fn device ->
      Tuple.to_list(device.ip)
      |> Enum.join(".") == ip
    end)
    IO.inspect(service)
    LightningBug.CurrentService.set(service)
    render(conn, :ok)
  end

  def set_spotlight(conn, requestJSON) do
    payload = %{}
    |> Map.put("lights", Map.get(requestJSON,"lights"))
    |> Map.put("total", Map.get(requestJSON,"total"))
    |> Map.put("speed", Map.get(requestJSON,"speed"))
    |> Map.put("brightness", Map.get(requestJSON,"brightness"))
    |> Map.put("method", Map.get(requestJSON,"method"))
    |> Map.put("size", Map.get(requestJSON,"size"))
    |> Map.put("colors", Map.get(requestJSON,"colors"))

    {:ok, datetime, 0} = DateTime.from_iso8601(Map.get(requestJSON, "runTime"))
    LightningBug.TaskRunner.run_now({:spotlight, payload, datetime})
    render(conn, :ok)
  end

  def set(conn, requestJSON) do
    payload = %{}
    |> Map.put("total", Map.get(requestJSON,"total"))
    |> Map.put("speed", Map.get(requestJSON,"speed"))
    |> Map.put("brightness", Map.get(requestJSON,"brightness"))
    |> Map.put("method", Map.get(requestJSON,"method"))
    |> Map.put("size", Map.get(requestJSON,"size"))
    |> Map.put("colors", Map.get(requestJSON,"colors"))

    {:ok, datetime, 0} = DateTime.from_iso8601(Map.get(requestJSON, "runTime"))
    LightningBug.TaskRunner.run_now({:set_pattern, payload, datetime})
    render(conn, :ok)
  end


  def convert_colors(color) do
      %Chameleon.RGB{r: r, g: g, b: b} = Chameleon.convert(color, Chameleon.RGB)
      [r, g, b]
  end
end
