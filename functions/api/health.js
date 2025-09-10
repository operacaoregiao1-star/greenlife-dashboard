export async function onRequestGet() {
  return new Response(JSON.stringify({
    status: "ok",
    projeto: "greenlife_gamificacao_dashboard_v2",
    updated_at: new Date().toISOString(),
  }), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*"
    }
  });
}
