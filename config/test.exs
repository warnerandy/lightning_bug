import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :lightning_bug, LightningBugWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "UfDFAX/m5UAnpvoNMrMkn3ymDEEX9uFAw2CKTRq5MLqPYHAxQwJ8PrIfxKLWIyhw",
  server: false

# In test we don't send emails.
config :lightning_bug, LightningBug.Mailer,
  adapter: Swoosh.Adapters.Test

# Disable swoosh api client as it is only required for production adapters.
config :swoosh, :api_client, false

# Print only warnings and errors during test
config :logger, level: :warning

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
