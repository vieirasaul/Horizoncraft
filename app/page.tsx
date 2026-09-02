import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Flame,
  Layers3,
  Sparkles,
  Zap,
} from "lucide-react";
import { CharacterCard } from "@/components/character-card";
import {
  ComicBurst,
  HalftonePattern,
  Sticker,
} from "@/components/comic-decorations";
import { CoverArt } from "@/components/cover-art";
import { EmptyState } from "@/components/empty-state";
import { PowerBadge } from "@/components/power-badge";
import { PublicShell } from "@/components/public-shell";
import { SectionHeading } from "@/components/section-heading";
import { getCharacters, getGalleryItems, getStories } from "@/lib/data";

export default async function HomePage() {
  const [stories, characters, galleryItems] = await Promise.all([
    getStories(),
    getCharacters(),
    getGalleryItems(),
  ]);
  const specialMessage = stories.find(
    (story) => story.slug === "parabens-theo",
  );
  const regularStories = stories.filter(
    (story) => story.slug !== "parabens-theo",
  );
  const mainStory =
    regularStories.find((story) => story.featured) ?? regularStories[0];
  const storyChapters = (
    mainStory
      ? mainStory.chapters.map((chapter) => ({ story: mainStory, chapter }))
      : []
  ).sort(
    (first, second) =>
      first.chapter.chapterNumber - second.chapter.chapterNumber,
  );
  const firstChapter = storyChapters[0];
  const storyHref = firstChapter
    ? `/historias/${firstChapter.story.slug}/${firstChapter.chapter.slug}`
    : "/historias";
  const selectedCharacters = (
    characters.some((character) => character.featured)
      ? characters.filter((character) => character.featured)
      : characters
  ).slice(0, 6);
  const highlightedPowers = selectedCharacters
    .flatMap((character) => {
      const power = character.powers[0];
      return power ? [{ character, power }] : [];
    })
    .slice(0, 6);

  return (
    <PublicShell>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow sticker-label">
              <Sparkles size={16} /> Uma história de heróis, poderes e aventuras
            </p>
            <h1>
              <span>Bem-vindo ao</span>
              <span>Horizoncraft</span>
            </h1>
            <p className="hero-lead">
              Conheça os personagens, descubra seus poderes e acompanhe uma
              história que está apenas começando.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href={storyHref}>
                Começar a história <ArrowRight size={18} />
              </Link>
              <Link className="button button-secondary" href="/personagens">
                Conhecer os personagens
              </Link>
            </div>
          </div>
          <div
            className="hero-comic-art"
            role="img"
            aria-label="Composição abstrata provisória com portal, fogo, raios, materiais e energia fantasmagórica"
          >
            <span className="comic-cloud comic-cloud-one" />
            <span className="comic-cloud comic-cloud-two" />
            <span className="world-block block-blue" />
            <span className="world-block block-red" />
            <span className="world-block block-green" />
            <span className="world-block block-purple" />
            <span className="comic-portal" />
            <span className="comic-hero hero-one" />
            <span className="comic-hero hero-two" />
            <span className="comic-lightning" />
            <span className="comic-burst">EM BREVE</span>
          </div>
        </section>

        <section className="universe-intro" id="historia">
          <ComicBurst>UAU!</ComicBurst>
          <div>
            <p className="section-kicker">A história</p>
            <h2>Uma história está começando</h2>
          </div>
          <p>
            Horizoncraft é uma história criada por Théo, povoada por heróis,
            poderes extraordinários e mistérios que serão revelados a cada novo
            capítulo. Este site é o lugar onde essa aventura vai crescer,
            receber novos personagens e reunir os desenhos do seu criador.
          </p>
          <div className="building-strip" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </section>

        {specialMessage && (
          <section className="birthday-feature">
            <HalftonePattern className="birthday-dots" />
            <div className="page-width">
              <article className="birthday-card">
                <CoverArt
                  title={specialMessage.title}
                  accent={specialMessage.accent}
                  imageUrl={specialMessage.coverUrl}
                  label="Uma mensagem especial"
                  subtitle="O Horizoncraft agora tem um lugar só dele."
                />
                <div className="birthday-copy">
                  <Sticker>Uma mensagem especial</Sticker>
                  <h2>{specialMessage.title}</h2>
                  <p>O Horizoncraft agora tem um lugar só dele.</p>
                  <div className="birthday-rule" />
                  <p className="birthday-note">
                    Uma mensagem de abertura para celebrar Théo e tudo o que
                    ainda será contado nesta história.
                  </p>
                  {specialMessage.chapters[0] && (
                    <Link
                      className="button button-yellow"
                      href={`/historias/${specialMessage.slug}/${specialMessage.chapters[0].slug}`}
                    >
                      Ler a mensagem <BookOpen aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </article>
            </div>
          </section>
        )}

        <section className="home-story page-width">
          <SectionHeading
            eyebrow="A história"
            title="Acompanhe os capítulos de Horizoncraft"
            description="Os capítulos publicados aparecerão em sequência conforme a história avançar."
          />
          {firstChapter ? (
            <Link className="chapter-spotlight" href={storyHref}>
              <span>Capítulo {firstChapter.chapter.chapterNumber}</span>
              <strong>{firstChapter.chapter.title}</strong>
              <ArrowRight aria-hidden="true" />
            </Link>
          ) : (
            <EmptyState
              title="O primeiro capítulo ainda está esperando para ser escrito."
              description="Quando estiver pronto, ele aparecerá aqui para começar a história de Horizoncraft."
            />
          )}
          <div className="home-section-actions">
            <Link className="button button-secondary" href="/historias">
              Conhecer a história <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="heroes-section">
          <div className="page-width">
            <SectionHeading
              eyebrow="Primeiros personagens cadastrados"
              title="Personagens em destaque"
              description="Conheça alguns dos personagens que fazem parte da história de Horizoncraft."
            />
            {selectedCharacters.length ? (
              <div className="collectible-grid">
                {selectedCharacters.map((character) => (
                  <CharacterCard character={character} key={character.id} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Os personagens aparecerão aqui em breve."
                description="Esta área está pronta para receber quem fará parte da história."
              />
            )}
            <div className="home-section-actions">
              <Link className="button button-primary" href="/personagens">
                Ver todos os personagens <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="powers-section">
          <div className="page-width powers-layout">
            <div>
              <p className="section-kicker">Habilidades da história</p>
              <h2>Poderes do Horizoncraft</h2>
              <p>
                Fogo, eletricidade, transformação e energia fantasmagórica são
                apenas algumas das habilidades que fazem parte desta história.
              </p>
              <Link className="button button-yellow" href="/poderes">
                Ver todos os poderes <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            <div className="power-showcase">
              {highlightedPowers.map(({ character, power }) => (
                <article
                  className={`power-poster accent-${character.accent}`}
                  key={`${character.id}-${power.id}`}
                >
                  {character.slug === "caveira-vermelha" ? (
                    <Flame />
                  ) : character.slug === "kauan-raio" ? (
                    <Zap />
                  ) : character.slug === "metanic" ? (
                    <Layers3 />
                  ) : (
                    <Sparkles />
                  )}
                  <h3>{power.name}</h3>
                  <PowerBadge name={character.name} accent={character.accent} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="gallery-preview page-width">
          <SectionHeading
            eyebrow="Galeria"
            title="Desenhos do Horizoncraft"
            description="Aqui ficarão os personagens, cenas, símbolos e lugares desenhados para a história."
          />
          {galleryItems.length ? (
            <div className="mini-gallery">
              {galleryItems.slice(0, 3).map((item) => (
                <span key={item.id}>{item.title}</span>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Os primeiros desenhos do Horizoncraft aparecerão aqui em breve."
              description="A galeria está pronta para receber os desenhos quando eles estiverem prontos."
            />
          )}
          <div className="home-section-actions">
            <Link className="button button-secondary" href="/galeria">
              Ver a galeria <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="about-horizoncraft">
          <div className="page-width about-grid">
            <div className="about-mark" aria-hidden="true">
              <span>H</span>
            </div>
            <div>
              <p className="section-kicker">Sobre Horizoncraft</p>
              <h2>Uma aventura criada por Théo</h2>
            </div>
            <div>
              <p>
                Horizoncraft reúne os personagens, poderes, desenhos e capítulos
                de uma história que continuará crescendo com novas ideias.
              </p>
              <Link className="text-link" href="/historias">
                Conhecer a história <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
