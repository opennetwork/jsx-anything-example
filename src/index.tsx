import { render, DOMVContext, createTimeline, Timeline } from '@opennetwork/vdom';
import { SiteBody } from './site';
import { h } from "./h";
import { hookFragments } from '@opennetwork/vnode-fragment';

async function renderInto(id: string) {

    const root = document.getElementById(id);

    if (!root) {
        throw new Error("Expected root");
    }

    const context = new DOMVContext({
        root
    });

    // const timelinePromise = createTimeline(
    //   context,
    //   reportTimeline
    // );

    await render(
      await hookFragments()(<SiteBody />),
      context
    );


    await context.close();

    // await reportTimeline(await timelinePromise);
}

async function reportTimeline(timeline: Timeline) {
    // console.log(timeline[timeline.length - 1]);
}

async function run(id = "root") {

    await renderInto(id);
}

window.proposalSiteRender = run("root");
window.proposalSiteRender.catch(error => {
    throw error;
});

