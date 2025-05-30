import React from "react";

export default function Vilkaar() {
  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: 800,
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
        color: "#222",
        background: "#fff",
        lineHeight: 1.7,
      }}
    >
      <h1
        style={{
          fontSize: "2.4rem",
          fontWeight: 700,
          marginBottom: "1rem",
          letterSpacing: "-1px",
        }}
      >
        Vilkår og Betingelser for HouseHub
      </h1>
      <p style={{ marginBottom: "2rem", color: "#666" }}>
        <strong>Sidst opdateret:</strong> 29. maj 2025
      </p>

      <p style={paragraphStyle}>
        Velkommen til HouseHub! Vi er glade for at have dig med på vores platform, hvor hussælgere og ejendomsmæglere kan finde hinanden nemt og trygt. Nedenfor finder du vores vilkår og betingelser.
      </p>

      <h2 style={sectionHeadingStyle}>1. Overordnede Rammer</h2>
      <p style={paragraphStyle}>
        <strong>1.1 Formål:</strong> HouseHub fungerer som en digital markedsplads, der skaber forbindelse mellem hussælgere ("Sælgere") og autoriserede ejendomsmæglere ("Mæglere"). Bemærk, at HouseHub ikke er part i aftaler mellem Sælger og Mægler.
      </p>
      <p style={paragraphStyle}>
        <strong>1.2 Brugerkrav:</strong> Du skal være mindst 18 år og have retlig handleevne for at oprette en konto. Når du registrerer dig, bekræfter du samtidig, at dine oplysninger er korrekte.
      </p>

      <h2 style={sectionHeadingStyle}>2. Sælgers Ansvar</h2>
      <p style={paragraphStyle}>
        <strong>2.1 Oprettelse af boligannonce:</strong> Som Sælger er du ansvarlig for, at alle oplysninger i din annonce – inklusiv beskrivelser, billeder og priser – er korrekte og lovlige.
      </p>
      <p style={paragraphStyle}>
        <strong>2.2 Ejendomsret:</strong> Du garanterer, at du har ret til at sælge boligen, og at din annonce ikke krænker andres rettigheder.
      </p>
      <p style={paragraphStyle}>
        <strong>2.3 Kommunikation:</strong> Du forpligter dig til at svare ærligt og hurtigt på henvendelser fra Mæglere via platformen.
      </p>

      <h2 style={sectionHeadingStyle}>3. Mæglers Ansvar</h2>
      <p style={paragraphStyle}>
        <strong>3.1 Tilbud:</strong> Mæglere skal være registrerede og autoriserede ejendomsmæglere i Danmark og følge alle gældende regler og love.
      </p>
      <p style={paragraphStyle}>
        <strong>3.2 Professionalisme:</strong> Som Mægler forpligter du dig til altid at levere professionelle og lovlige ydelser og give Sælgere gennemsigtige og realistiske tilbud.
      </p>
      <p style={paragraphStyle}>
        <strong>3.3 Oplysninger:</strong> Du skal give præcise oplysninger om dine kvalifikationer, erfaringer og eventuelle gebyrer.
      </p>

      <h2 style={sectionHeadingStyle}>4. HouseHubs Rolle og Ansvar</h2>
      <p style={paragraphStyle}>
        <strong>4.1 Formidler:</strong> HouseHub er udelukkende en platform, der forbinder Sælgere og Mæglere. Vi påtager os ikke ansvar for selve indholdet af annoncer eller kvaliteten af Mægleres ydelser.
      </p>
      <p style={paragraphStyle}>
        <strong>4.2 Indholdsmoderation:</strong> Vi forbeholder os retten til at fjerne annoncer eller suspendere brugere, hvis de overtræder disse vilkår eller lovgivningen.
      </p>
      <p style={paragraphStyle}>
        <strong>4.3 Ingen garanti:</strong> Platformen leveres "som den er", og vi kan ikke garantere, at tjenesten altid er fejlfri eller tilgængelig uden afbrydelser.
      </p>

      <h2 style={sectionHeadingStyle}>5. Betalinger</h2>
      <p style={paragraphStyle}>
        <strong>5.1 Gebyrer:</strong> HouseHub kan opkræve gebyrer for visse tjenester, såsom oprettelse af annoncer eller promovering. Alle gebyrer vil fremgå tydeligt på platformen.
      </p>
      <p style={paragraphStyle}>
        <strong>5.2 Betalinger mellem Sælgere og Mæglere:</strong> Eventuelle betalinger for mæglerens ydelser aftales direkte mellem Sælger og Mægler. HouseHub har intet ansvar for disse transaktioner.
      </p>

      <h2 style={sectionHeadingStyle}>6. Persondata og Privatliv</h2>
      <p style={paragraphStyle}>
        <strong>6.1 GDPR-overholdelse:</strong> Vi behandler dine personoplysninger i overensstemmelse med GDPR og dansk lovgivning. Læs gerne vores privatlivspolitik for mere information.
      </p>
      <p style={paragraphStyle}>
        <strong>6.2 Dataansvar:</strong> Både Sælgere og Mæglere er ansvarlige for at sikre, at de oplysninger, de deler, er i overensstemmelse med gældende databeskyttelseslovgivning.
      </p>

      <h2 style={sectionHeadingStyle}>7. Ansvarsbegrænsning</h2>
      <p style={paragraphStyle}>
        <strong>7.1 Platformens ansvar:</strong> HouseHub kan ikke holdes ansvarlig for tab, skader eller tvister, der opstår mellem Sælgere og Mæglere – heller ikke økonomiske tab eller forkerte oplysninger.
      </p>
      <p style={paragraphStyle}>
        <strong>7.2 Force Majeure:</strong> Vi er ikke ansvarlige for forhold uden for vores kontrol, som kan føre til forsinkelse eller manglende opfyldelse af vores forpligtelser.
      </p>

      <h2 style={sectionHeadingStyle}>8. Tvistløsning</h2>
      <p style={paragraphStyle}>
        <strong>8.1 Gældende lov:</strong> Disse vilkår er underlagt dansk lov.
      </p>
      <p style={paragraphStyle}>
        <strong>8.2 Tvister:</strong> Hvis der opstår uenighed om brugen af HouseHub, forsøger vi altid først at løse det gennem dialog. Lykkes det ikke, afgøres tvisten ved danske domstole.
      </p>

      <h2 style={sectionHeadingStyle}>9. Ændringer i Vilkårene</h2>
      <p style={paragraphStyle}>
        <strong>9.1</strong> Vi kan til enhver tid ændre vilkårene. Du vil blive informeret via platformen, og fortsætter du med at bruge HouseHub efter ændringer, betragtes det som accept af de nye vilkår.
      </p>

      <h2 style={sectionHeadingStyle}>10. Kontakt</h2>
      <p style={paragraphStyle}>
        Har du spørgsmål til vores vilkår, er du altid velkommen til at kontakte os:<br /><br />
        <strong>E-mail:</strong> info@househub.dk<br />
        <strong>Adresse:</strong> Thors Have 6, 8600 Silkeborg
      </p>
      <p style={{ marginTop: "2.5rem", fontWeight: 600 }}>
        Ved at bruge HouseHub accepterer du automatisk disse vilkår og betingelser.
      </p>
    </div>
  );
}

// Styles
const sectionHeadingStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: 700,
  marginTop: "2.5rem",
  marginBottom: "1rem",
  letterSpacing: "-0.5px",
};

const paragraphStyle: React.CSSProperties = {
  marginBottom: "1.5rem",
  marginTop: 0,
};
