/**
 * Buzzes William's phone through ntfy (the ntfy app, subscribed to the topic
 * in NTFY_TOPIC). No account or keys: the topic name is the password, so keep
 * it long and out of the repo. Quiet when unset, and a failed alert never
 * fails the lead, since the email is the record. Tapping the alert opens a
 * text to the lead, with Call and Email buttons; a lead with no phone opens
 * an email instead. Shared by the lead routes
 * (free website review, free home page design).
 */
export async function alertWilliam(alert: { title: string; message: string; phone: string; email: string }) {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) return;

  const digits = alert.phone.replace(/\D/g, "");
  const dial = digits ? (digits.length === 10 ? `+1${digits}` : `+${digits}`) : "";
  const email = { action: "view", label: "Email", url: `mailto:${alert.email}` };
  try {
    const res = await fetch("https://ntfy.sh/", {
      method: "POST",
      body: JSON.stringify({
        topic,
        title: alert.title,
        message: alert.message,
        priority: 4,
        tags: ["four_leaf_clover"],
        click: dial ? `sms:${dial}` : `mailto:${alert.email}`,
        actions: dial ? [{ action: "view", label: "Call", url: `tel:${dial}` }, email] : [email],
      }),
    });
    if (!res.ok) console.error("alertWilliam: alert not sent:", res.status, await res.text());
  } catch (err) {
    console.error("alertWilliam: alert not sent:", err);
  }
}
