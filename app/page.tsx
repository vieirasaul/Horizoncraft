import Image from "next/image";
import Link from "next/link";
import {
  Anvil,
  ArrowRight,
  BookOpen,
  Flame,
  Ghost,
  Layers3,
  Skull,
  Sparkles,
  Zap,
} from "lucide-react";
import { AnimatedHeroTitle } from "@/components/animated-hero-title";
import { CharacterCard } from "@/components/character-card";
import { HalftonePattern, Sticker } from "@/components/comic-decorations";
import { CoverArt } from "@/components/cover-art";
import { EmptyState } from "@/components/empty-state";
import { PowerBadge } from "@/components/power-badge";
import { PublicShell } from "@/components/public-shell";
import { SectionHeading } from "@/components/section-heading";
import {
  getCharacterVisualKey,
  SPECIAL_MESSAGE_CHAPTER_ID,
} from "@/lib/content-identity";
import { getCharacters, getGalleryItems, getStories } from "@/lib/data";

export default async function HomePage() {
  const [stories, characters, galleryItems] = await Promise.all([
    getStories(),
    getCharacters(),
    getGalleryItems(),
  ]);
  const mainStory = stories.find((story) => story.featured) ?? stories[0];
  const specialMessage = mainStory?.chapters.find(
    (chapter) => chapter.id === SPECIAL_MESSAGE_CHAPTER_ID,
  );
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
    ? `/capitulos/${firstChapter.chapter.slug}`
    : "/capitulos";
  const selectedCharacters = characters.slice(0, 4);
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
            <AnimatedHeroTitle />
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
            aria-label="Emblema HC cercado por um portal e símbolos da Caveira Vermelha, Kauan Raio, Metanic e Blood Phantom"
          >
            <span className="comic-cloud comic-cloud-one" />
            <span className="comic-cloud comic-cloud-two" />
            <span className="world-block block-blue" />
            <span className="world-block block-red" />
            <span className="world-block block-green" />
            <span className="world-block block-purple" />
            <span className="comic-portal" />
            <span className="comic-lightning" />
            <span className="comic-monogram">HC</span>
            <span className="hero-symbol hero-symbol-skull">
              <Skull aria-hidden="true" strokeWidth={2.6} />
            </span>
            <span className="hero-symbol hero-symbol-lightning">
              <Zap aria-hidden="true" fill="currentColor" strokeWidth={2.6} />
            </span>
            <span className="hero-symbol hero-symbol-metal">
              <Anvil aria-hidden="true" strokeWidth={2.6} />
            </span>
            <span className="hero-symbol hero-symbol-ghost">
              <Ghost aria-hidden="true" strokeWidth={2.6} />
            </span>
          </div>
        </section>

        <section className="universe-intro" id="historia">
          <div className="intro-hero-silhouette" aria-hidden="true">
            <span className="intro-hero-cape" />
            <span className="intro-hero-head" />
            <span className="intro-hero-torso" />
            <span className="intro-hero-arm intro-hero-arm-left" />
            <span className="intro-hero-arm intro-hero-arm-right" />
          </div>
          <div className="universe-intro-heading">
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

        {mainStory && specialMessage && (
          <section className="birthday-feature">
            <HalftonePattern className="birthday-dots" />
            <div className="page-width">
              <article className="birthday-card">
                <CoverArt
                  title={specialMessage.title}
                  accent={mainStory.accent}
                  imageUrl={mainStory.coverUrl}
                  label="Mensagem especial"
                  subtitle="Uma mensagem de abertura para celebrar Théo."
                />
                <div className="birthday-copy">
                  <Sticker>Mensagem especial</Sticker>
                  <h2>{specialMessage.title}</h2>
                  <p className="birthday-note">
                    Uma mensagem de abertura para celebrar Théo e tudo o que
                    ainda será contado nesta história.
                  </p>
                  <div className="birthday-rule" />
                  <Link
                    className="button button-yellow"
                    href={`/capitulos/${specialMessage.slug}`}
                  >
                    Ler a mensagem <BookOpen aria-hidden="true" />
                  </Link>
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
            <Link className="button button-secondary" href="/capitulos">
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
              {highlightedPowers.map(({ character, power }) => {
                const visualKey = getCharacterVisualKey(
                  character.id,
                  character.slug,
                );

                return (
                  <article
                    className={`power-poster accent-${character.accent}`}
                    key={`${character.id}-${power.id}`}
                  >
                    {visualKey === "caveira-vermelha" ? (
                      <Flame />
                    ) : visualKey === "kauan-raio" ? (
                      <Zap />
                    ) : visualKey === "metanic" ? (
                      <Layers3 />
                    ) : (
                      <Sparkles />
                    )}
                    <h3>{power.name}</h3>
                    <PowerBadge
                      name={character.name}
                      accent={character.accent}
                    />
                  </article>
                );
              })}
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
              {galleryItems.slice(0, 4).map((item) => (
                <Link
                  className={`mini-gallery-card accent-${item.accent}`}
                  href="/galeria"
                  aria-label={`Ver ${item.title} na galeria`}
                  key={item.id}
                >
                  <span className="mini-gallery-image">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 580px) calc(100vw - 32px), (max-width: 820px) calc(50vw - 26px), 280px"
                      />
                    ) : (
                      <span>{item.title}</span>
                    )}
                  </span>
                  <strong>{item.title}</strong>
                </Link>
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
      </main>
    </PublicShell>
  );
}
