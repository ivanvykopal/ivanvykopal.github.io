import { MaterialCard } from "./MaterialCard";

export default function Page() {
  return (
    <section>
      <h1 className="font-bold text-2xl mb-8 tracking-tighter">Machine Learning & Deep Learning</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <ul>
          <li>
            <MaterialCard
              name="Artificial Intelligence Course from Stanford"
              link="https://www.youtube.com/playlist?list=PLoROMvodv4rOca_Ovz1DvdtWuz8BfSWL2"
              type="video"
            />
          </li>
          <li>
            <MaterialCard
              name="Transformers United Course from Stanford"
              link="https://www.youtube.com/playlist?list=PLoROMvodv4rNiJRchCzutFw5ItR_Z27CM"
              type="video"
            />
          </li>
          <li>
            <MaterialCard
              name="Deep Learning Course from Stanford"
              link="https://www.youtube.com/watch?v=PySo_6S4ZAg&list=PLoROMvodv4rOABXSygHTsbvUz4G_YQhOb"
              type="video"
            />
          </li>
        </ul>
      </div>
      <h1 className="font-bold text-2xl mb-8 tracking-tighter">Natural Language Processing</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <ul>
          <li>
            <MaterialCard
              name="Hugging Face NLP Course"
              link="https://huggingface.co/learn/nlp-course"
              type="text"
            />
          </li>
          <li>
            <MaterialCard
              name="Hugging Face Agents Course"
              link="https://huggingface.co/learn/agents-course"
              type="text"
            />
          </li>
          <li>
            <MaterialCard
              name="Hugging Face Deep RL Course"
              link="https://huggingface.co/learn/deep-rl-course"
              type="text"
            />
          </li>
          <li>
            <MaterialCard
              name="NLP Course from Stanford"
              link="https://web.stanford.edu/class/cs224n/"
              type="text"
            />
          </li>
          <li>
            <MaterialCard
              name="NLP Course from Stanford (Winter 2021)"
              link="https://www.youtube.com/playlist?list=PLoROMvodv4rOSH4v6133s9LFPRHjEmbmJ"
              type="video"
            />
          </li>
        </ul>
      </div>
      <h1 className="font-bold text-2xl mb-8 tracking-tighter">Computer Vision</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <ul>
          <li>
            <MaterialCard
              name="Computer Vision Course from Stanford"
              link="http://cs231n.stanford.edu/"
              type="text"
            />
          </li>
          <li>
            <MaterialCard
              name="Computer Vision Course from Stanford (Spring 2017)"
              link="https://www.youtube.com/watch?v=vT1JzLTH4G4&list=PLSVEhWrZWDHQTBmWZufjxpw3s8sveJtnJ"
              type="video"
            />
          </li>
        </ul>
      </div>
      {/* <h1 className="font-bold text-2xl mb-8 tracking-tighter">Tools & Frameworks</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <ul>
        </ul>
      </div> */}
    </section>
  );
}
