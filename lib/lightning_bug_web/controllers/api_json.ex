defmodule LightningBugWeb.ApiJSON do
  alias Mdns.Client.Device
  @doc """
  Renders a list of urls.
  """
  def index(%{servers: servers}) when servers != nil do
    # %{hello: "world"}
    %{data: for(server <- servers, do: data(server))}
  end

  def index(%{servers: servers}) when servers == nil do
    # %{hello: "world"}
    %{data: [], message: "no data"}
  end

  def load(%{pixels: pixels}) do
    IO.inspect(pixels)
    %{data: pixels}
  end

  def start(_params) do
    %{start: "ok"}
  end

  def stop(_params) do
    %{stop: "ok"}
  end

  def ok(_params) do
    %{success: "ok"}
  end

  def errors(%{errors: errors}) when errors != nil do
    %{data: for(err <- errors, do: error(err))}
  end

  defp error(err) do
    err
  end

  defp data(%Device{} = device) do
    %{
      ip: device.ip |> Tuple.to_list |> Enum.join("."),
      port: device.port,
      domain: device.domain,
      services: device.services
    }
  end
end