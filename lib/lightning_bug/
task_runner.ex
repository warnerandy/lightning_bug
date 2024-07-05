defmodule LightningBug.TaskRunner do
  use GenServer
  
  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end
  
  @impl true
  def init(state) do
    :timer.send_interval(60_000, :work)
    {:ok, state}
  end

  @impl true
  def handle_cast({:push, task}, state) do
    # IO.puts("adding task")
    IO.inspect(task)
    {:noreply, [task | state]}
  end

  @impl true
  def handle_cast(:work, state) do
    check_tasks(state)
    {:noreply, state}
  end

  @impl true
  def handle_info(:work, state) do
    check_tasks(state)

    {:noreply, keep_tasks(state)}
  end


  def run_now(task) do
    GenServer.cast(__MODULE__, {:push, task})
    GenServer.cast(__MODULE__, :work)
  end
  
  defp check_tasks(state) do
    # IO.puts("running scheduled task")
    Enum.filter(state, fn({_task, _config, date}) -> DateTime.compare(DateTime.utc_now(), date) == :gt end)
    |> Enum.each(&run_task/1)
    run_task({:errors, nil, nil})
  end

  defp keep_tasks(state) do
    Enum.filter(state, fn({_task, _config, date}) -> DateTime.compare(DateTime.utc_now(), date) == :lt end)
  end

  defp run_task({:set_pattern, config, _date}) do
    IO.puts("running pattern task")
    IO.inspect(config)
    service = LightningBug.CurrentService.get()
    set_lights(service, config)
  end

  defp run_task({:spotlight, config, _date}) do
    IO.puts("running spotlight task")
    IO.inspect(config)
    service = LightningBug.CurrentService.get()
    IO.inspect(service)
    spotlight(service, config)
  end

  defp run_task({:off, config, _date}) do
    service = LightningBug.CurrentService.get()
    blackout(service, config)
  end

  defp run_task({:errors, _config, _date}) do
    IO.puts("getting errors")
    service = LightningBug.CurrentService.get()
    {:ok, error_list} = get_errors(service)
    LightningBug.CurrentService.set_errors(error_list)
  end

  defp spotlight(service, _config) when is_nil(service) do
    IO.puts("no service! ")
  end

  defp spotlight(service, %{"lights" => lights, "total" => total, "speed" => speed, "brightness" => brightness, "method" => method, "size" => size, "colors" => colors}) when not is_nil(service) do
    computed_lights = lights
    |> Enum.map(fn light -> if Map.get(light,"isOn"), do: convert_colors(Map.get(light,"color")), else: convert_colors("#000000") end)

    computedColors = Enum.map(colors, fn color -> convert_colors(color) end)
    ip = Tuple.to_list(service.ip)
      |> Enum.join(".")

    payload = Poison.encode!(%{:pixels => computed_lights, :speed => speed / 100, :total => total, :method => method, :brightness => brightness, :size => size, :colors => computedColors})
    # IO.puts(payload)
    headers = [{"Content-type", "application/json"}]
    {:ok, %HTTPoison.Response{status_code: 200, body: _body}} = HTTPoison.post("#{ip}/update", payload, headers, [:timeout, 60000])
  end

  defp set_lights(service, %{"total" => total, "speed" => speed, "brightness" => brightness, "method" => method, "size" => size, "colors" => colors}) when not is_nil(service) do
    computedColors = colors 
    |> Enum.map(fn color -> convert_colors(color) end)
    # IO.inspect(colors)
    ip = Tuple.to_list(service.ip)
    |> Enum.join(".")
    # IO.puts("sending to device")
    payload = Poison.encode!(%{:pixels => [], :speed => speed / 100, :total => total, :method => method, :brightness => brightness, :size => size, :colors => computedColors})
    # IO.puts(payload)
    headers = [{"Content-type", "application/json"}]
    {:ok, %HTTPoison.Response{status_code: 200, body: _body}} = HTTPoison.post("#{ip}/update", payload, headers, [:timeout, 60000])
  end

  defp set_lights(service, _config) when is_nil(service) do
    IO.puts("No Lightning Bug Service configured!")
  end

  defp blackout(service, _config) when is_nil(service) do
    IO.puts("No Lightning Bug Service configured!")
  end

  defp blackout(service, _config) when not is_nil(service) do
    ip = Tuple.to_list(service.ip)
    |> Enum.join(".")
    payload = Poison.encode!(%{:pixels => [], :speed => 0, :method => "clear", :brightness => 0, :size => 1, :colors => []})
    headers = [{"Content-type", "application/json"}]
    {:ok, %HTTPoison.Response{status_code: 200, body: _body}} = HTTPoison.post("#{ip}/update", payload, headers, [:timeout, 60000])
  end

  defp convert_colors(color) do
      %Chameleon.RGB{r: r, g: g, b: b} = Chameleon.convert(color, Chameleon.RGB)
      [r, g, b]
  end

  defp get_errors(service) when is_nil(service) do  

  end
  defp get_errors(service) when not is_nil(service) do  
    ip = Tuple.to_list(service.ip)
    {:ok, %HTTPoison.Response{status_code: 200, body: _body}} = HTTPoison.get("#{ip}/errors", [:timeout, 60000])
  end
end