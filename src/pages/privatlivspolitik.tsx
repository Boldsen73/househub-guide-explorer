import React from "react";

export default function Privatlivspolitik() {
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
        Privatlivspolitik for HouseHub
      </h1>
      <p style={{ marginBottom: "2rem", color: "#666" }}>
        <strong>Sidst opdateret:</strong> 29. maj 2025
      </p>

      <p style={{ marginBottom: "2rem" }}>
        Hos HouseHub tager vi beskyttelsen af dine personoplysninger alvorligt. Denne privatlivspolitik beskriver, hvordan vi indsamler, behandler og beskytter dine personoplysninger i overensstemmelse med gældende lovgivning.
      </p>

      <h2 style={sectionHeadingStyle}>1. Dataansvarlig</h2>
      <p style={paragraphStyle}>
        HouseHub er dataansvarlig for behandlingen af dine personoplysninger. Du kan kontakte os på:<br />
        <strong>E-mail:</strong> info@househub.dk<br />
        <strong>Adresse:</strong> Thors Have 6, 8600 Silkeborg
      </p>

      <h2 style={sectionHeadingStyle}>2. Hvilke personoplysninger indsamler vi?</h2>
      <p style={paragraphStyle}>Vi indsamler og behandler følgende typer af personoplysninger:</p>
      <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>2.1 Oplysninger fra Sælgere:</p>
      <ul style={listStyle}>
        <li>Navn, e-mailadresse, telefonnummer og adresse.</li>
        <li>Oplysninger om boligen, herunder adresse, beskrivelser, billeder og prisforventninger.</li>
        <li>Kommunikation gennem platformen, f.eks. beskeder til Mæglere.</li>
      </ul>
      <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>2.2 Oplysninger fra Mæglere:</p>
      <ul style={listStyle}>
        <li>Navn, e-mailadresse, telefonnummer og forretningsadresse.</li>
        <li>Oplysninger om autorisation, kvalifikationer og erfaring.</li>
        <li>Tilbud og kommunikation med Sælgere gennem platformen.</li>
      </ul>
      <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>2.3 Tekniske oplysninger:</p>
      <ul style={listStyle}>
        <li>IP-adresse, browsertype, enhedsoplysninger og brugsmønstre på platformen (via cookies eller lignende teknologier, jf. afsnit 7).</li>
      </ul>

      <h2 style={sectionHeadingStyle}>3. Formål med behandlingen</h2>
      <p style={paragraphStyle}>Vi behandler dine personoplysninger til følgende formål:</p>
      <ul style={listStyle}>
        <li>At levere og administrere platformens tjenester, herunder oprettelse af boligannoncer og formidling af kontakt mellem Sælgere og Mæglere.</li>
        <li>At forbedre brugeroplevelsen og funktionaliteten på platformen.</li>
        <li>At opfylde juridiske forpligtelser, såsom bogføringsloven eller hvidvaskloven.</li>
        <li>At sende meddelelser om ændringer i vores tjenester eller vilkår.</li>
      </ul>

      <h2 style={sectionHeadingStyle}>4. Retsgrundlag for behandling</h2>
      <p style={paragraphStyle}>Vi behandler dine personoplysninger på følgende retsgrundlag:</p>
      <ul style={listStyle}>
        <li><strong>Aftale (GDPR artikel 6(1)(b)):</strong> Når du opretter en konto eller bruger vores tjenester, behandler vi dine oplysninger for at opfylde vores aftale med dig.</li>
        <li><strong>Samtykke (GDPR artikel 6(1)(a)):</strong> Hvis du giver samtykke, f.eks. til markedsføring eller cookies, behandler vi oplysninger på dette grundlag.</li>
        <li><strong>Retslig forpligtelse (GDPR artikel 6(1)(c)):</strong> Vi behandler oplysninger for at overholde gældende lovgivning.</li>
        <li><strong>Legitim interesse (GDPR artikel 6(1)(f)):</strong> Vi kan behandle oplysninger for at forbedre vores tjenester eller sikre platformens funktionalitet, så længe det ikke krænker dine rettigheder.</li>
      </ul>

      <h2 style={sectionHeadingStyle}>5. Deling af personoplysninger</h2>
      <p style={{ ...paragraphStyle, marginBottom: "0.5rem" }}>
        <strong>5.1 Med andre brugere:</strong> Sælgeres boligannoncer og kontaktoplysninger deles med Mæglere, og Mægleres tilbud og kontaktoplysninger deles med Sælgere som en del af platformen.
      </p>
      <p style={paragraphStyle}>
        <strong>5.2 Tredjeparter:</strong> Vi kan dele dine oplysninger med:
      </p>
      <ul style={listStyle}>
        <li>Tjenesteudbydere, der hjælper os med at drive platformen (f.eks. hosting, betalingsbehandling), underlagt databehandleraftaler.</li>
        <li>Offentlige myndigheder, hvis det kræves ved lov.</li>
      </ul>
      <p style={paragraphStyle}>Vi videregiver ikke dine oplysninger til tredjeparter til markedsføringsformål uden dit samtykke.</p>

      <h2 style={sectionHeadingStyle}>6. Opbevaring og sletning</h2>
      <ul style={listStyle}>
        <li>
          <strong>6.1 Opbevaring:</strong> Vi opbevarer dine personoplysninger, så længe det er nødvendigt for at opfylde formålene i afsnit 3 eller for at overholde lovgivningen. For eksempel opbevares oplysninger om handler i henhold til bogføringsloven.
        </li>
        <li>
          <strong>6.2 Sletning:</strong> Når dine oplysninger ikke længere er nødvendige, slettes eller anonymiseres de. Du kan anmode om sletning af dine oplysninger, medmindre vi er forpligtet til at opbevare dem.
        </li>
      </ul>

      <h2 style={sectionHeadingStyle}>7. Cookies og sporing</h2>
      <p style={paragraphStyle}>
        Vi bruger cookies og lignende teknologier til at forbedre brugeroplevelsen, analysere brugsmønstre og levere målrettet indhold. Du kan styre dit samtykke til cookies via vores cookie-indstillinger.
      </p>

      <h2 style={sectionHeadingStyle}>8. Dine rettigheder</h2>
      <p style={paragraphStyle}>Under GDPR har du følgende rettigheder:</p>
      <ul style={listStyle}>
        <li><strong>Ret til indsigt:</strong> Du kan anmode om at se de oplysninger, vi har om dig.</li>
        <li><strong>Ret til berigtigelse:</strong> Du kan bede os om at rette urigtige oplysninger.</li>
        <li><strong>Ret til sletning:</strong> Du kan anmode om sletning af dine oplysninger, medmindre vi har en juridisk forpligtelse til at opbevare dem.</li>
        <li><strong>Ret til begrænsning:</strong> Du kan anmode om, at behandlingen af dine oplysninger begrænses i visse tilfælde.</li>
        <li><strong>Ret til dataportabilitet:</strong> Du kan anmode om at modtage dine oplysninger i et struktureret, almindeligt anvendt format.</li>
        <li><strong>Ret til at gøre indsigelse:</strong> Du kan gøre indsigelse mod behandlingen af dine oplysninger, f.eks. til markedsføringsformål.</li>
      </ul>
      <p style={paragraphStyle}>
        For at udøve dine rettigheder, kontakt os på <a href="mailto:info@househub.dk">info@househub.dk</a>.
      </p>

      <h2 style={sectionHeadingStyle}>9. Datasikkerhed</h2>
      <p style={paragraphStyle}>
        Vi anvender tekniske og organisatoriske foranstaltninger for at beskytte dine personoplysninger mod uautoriseret adgang, tab eller misbrug, herunder kryptering og sikre servere.
      </p>

      <h2 style={sectionHeadingStyle}>10. Overførsel til tredjelande</h2>
      <p style={paragraphStyle}>
        Hvis dine personoplysninger overføres til lande uden for EU/EØS, sikrer vi, at overførslen sker i overensstemmelse med GDPR, f.eks. gennem EU's standardkontraktklausuler.
      </p>

      <h2 style={sectionHeadingStyle}>11. Klager</h2>
      <p style={paragraphStyle}>
        Hvis du har en klage over vores behandling af dine personoplysninger, kan du kontakte os på <a href="mailto:info@househub.dk">info@househub.dk</a>. Du har også ret til at indgive en klage til Datatilsynet:<br />
        <strong>Adresse:</strong> Datatilsynet, Carl Jacobsens Vej 35, 2500 Valby<br />
        <strong>E-mail:</strong> dt@datatilsynet.dk
      </p>

      <h2 style={sectionHeadingStyle}>12. Ændringer i privatlivspolitikken</h2>
      <p style={paragraphStyle}>
        Vi forbeholder os retten til at opdatere denne privatlivspolitik. Ændringer vil blive offentliggjort på platformen, og væsentlige ændringer vil blive meddelt direkte til brugerne. Fortsat brug af HouseHub efter ændringer betragtes som accept af den opdaterede politik.
      </p>

      <h2 style={sectionHeadingStyle}>13. Kontakt</h2>
      <p style={paragraphStyle}>
        Hvis du har spørgsmål til denne privatlivspolitik, kan du kontakte os på:<br />
        <strong>E-mail:</strong> info@househub.dk<br />
        <strong>Adresse:</strong> Thors Have 6, 8600 Silkeborg
      </p>

      <p style={{ marginTop: "2.5rem", fontWeight: 600 }}>
        Ved at bruge HouseHub accepterer du denne privatlivspolitik.
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

const listStyle: React.CSSProperties = {
  marginBottom: "1.5rem",
  marginTop: 0,
  paddingLeft: "1.5rem",
  lineHeight: 1.7,
};
