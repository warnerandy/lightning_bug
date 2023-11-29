defmodule LightningBug.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      LightningBugWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: LightningBug.PubSub},
      # Start Finch
      {Finch, name: LightningBug.Finch},
      # Start the Endpoint (http/https)
      LightningBugWeb.Endpoint,
      LightningBug.CurrentService,
      LightningBug.TaskRunner
      # Start a worker by calling: LightningBug.Worker.start_link(arg)
      # {LightningBug.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: LightningBug.Supervisor]
    Mdns.Client.start()
    Mdns.Client.query("lightning-bug.local")
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    LightningBugWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
