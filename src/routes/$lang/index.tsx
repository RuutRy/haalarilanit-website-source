import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../../components/text";

export const Route = createFileRoute("/$lang/")({
  component: MainPage,
});

function MainPage() {
  const { lang } = Route.useParams();
  return <Article name="main" lang={lang} />;
}
