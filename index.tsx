import React, { useEffect } from 'react';
import { render } from 'react-dom';
import './style.css';

const App = () => {
  const drawFlows = () => {
    const dataFlows = document.querySelectorAll(
      '[data-flows]:not([data-flows=""])'
    );
    dataFlows.forEach((d: HTMLElement) => {
      const flowsList = d.dataset.flows.split(';').map((e) => e.split(','));
      const flowsElements = d.querySelectorAll('svg');

      flowsElements.forEach((e) => {
        d.removeChild(e);
      });

      flowsList.forEach(([s, e]) => {
        const flowSteps = d.querySelectorAll('[data-flow-step]');
        const flowStartStepElement = d.querySelectorAll(
          '[data-flow-step="' + s + '"]'
        )[0];
        const flowEndStepElement = d.querySelectorAll(
          '[data-flow-step="' + e + '"]'
        )[0];
        const flowStartStepElements = flowStartStepElement.querySelectorAll(
          '[data-flow-point]:not([data-flow-point=""])'
        );
        const flowEndStepElements = flowEndStepElement.querySelectorAll(
          '[data-flow-point]:not([data-flow-point=""])'
        );
        const flowStartStepPoints = [];

        flowStartStepElements.forEach((f: HTMLElement) => {
          if (f.dataset.flowTo) {
            const flowTo = f.dataset.flowTo.split(',');
            flowTo.forEach((v) => {
              const startChild = flowStartStepElement.querySelectorAll(
                '[data-flow-point="' + f.dataset.flowPoint + '"]'
              )[0];
              const startChildIndex = [].indexOf.call(
                startChild.parentNode.children,
                startChild
              );
              const endChild = flowEndStepElement.querySelectorAll(
                '[data-flow-point="' + v + '"]'
              )[0];
              const endChildIndex = [].indexOf.call(
                endChild.parentNode.children,
                endChild
              );
              flowStartStepPoints.push({
                g: startChildIndex + 1,
                d: endChildIndex + 1,
                s: s + '-' + f.dataset.flowPoint,
                e: e + '-' + v,
              });
            });
          }
        });

        const stepsAndFlowWidth = 100 / (flowSteps.length * 2 - 1);
        const h = d.offsetHeight;
        const w = (stepsAndFlowWidth / 100) * d.offsetWidth;
        const f =
          flowStartStepElement instanceof HTMLElement &&
          flowStartStepElement.offsetHeight / flowStartStepElements.length / 2;
        const g =
          flowEndStepElement instanceof HTMLElement &&
          flowEndStepElement.offsetHeight / flowEndStepElements.length / 2;
        const svg = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'svg'
        );
        svg.setAttribute('width', `${w}px`);
        svg.setAttribute('height', `${h}px`);

        const curves = flowStartStepPoints.map((p) => {
          return [
            p.s,
            p.e,
            [
              ((f / 2 - 3.25 * p.g + 0.75 + (p.g - 1) * f) * h) / 100,
              (107.52 / 150) * w,
              ((f / 2 - 3.25 * p.g + 0.75 + (p.g - 1) * f) * h) / 100,
              (116.48 / 150) * w,
              ((g / 2 - 3.25 * p.d + 0.75 + (p.d - 1) * g) * h) / 100,
              w,
              ((g / 2 - 3.25 * p.d + 0.75 + (p.d - 1) * g) * h) / 100,
            ],
          ];
        });

        curves.forEach(([g, d, c]) => {
          const path = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
          );
          path.setAttribute('fill', 'none');
          path.setAttribute('data-path', g + ',' + d);
          path.setAttribute(
            'd',
            'M0,' +
              c[0] +
              'C' +
              c[1] +
              ',' +
              c[2] +
              ', ' +
              c[3] +
              ',' +
              c[4] +
              ' ' +
              c[5] +
              ',' +
              c[6]
          );
          svg.appendChild(path);
        });
        flowStartStepElement.parentNode.insertBefore(
          svg,
          flowStartStepElement.nextSibling
        );
        flowSteps.forEach((s: HTMLElement) => {
          s.style.width = `${w}px`;
        });
      });
    });
  };

  useEffect(() => {
    drawFlows();
    const a = document.querySelectorAll(
      '[data-flow-point]:not([data-flow-point=""])'
    );
    const togglePathClass = (e) => {
      const flowPoint = e.target.dataset.flowPoint;
      const flowStep = e.target.parentNode.dataset.flowStep;
      const b = document.querySelectorAll(
        'path[data-path*="' + flowStep + '-' + flowPoint + '"]'
      );

      for (let j = 0; j < b.length; j++) {
        b[j].classList.toggle('blue');
      }
    };

    for (let i = 0; i < a.length; i++) {
      a[i].addEventListener(
        'mouseenter',
        (e) => {
          togglePathClass(e);
        },
        false
      );
      a[i].addEventListener(
        'mouseleave',
        (e) => {
          togglePathClass(e);
        },
        false
      );
    }
    window.addEventListener('resize', drawFlows);
    return () => {
      for (let i = 0; i < a.length; i++) {
        a[i].removeEventListener(
          'mouseenter',
          (e) => {
            togglePathClass(e);
          },
          false
        );
        a[i].removeEventListener(
          'mouseleave',
          (e) => {
            togglePathClass(e);
          },
          false
        );
      }
      window.removeEventListener('resize', drawFlows);
    };
  }, []);

  return (
    <div data-flows="1,2;2,3">
      <div data-flow-step="1">
        <div
          data-flow-point="aIn"
          data-flow-to="aMid,bMid"
          style={{ width: '150px', height: '200px' }}
        >
          a IN
        </div>
        <div data-flow-point="bIn" data-flow-to="bMid,cMid,dMid">
          b IN
        </div>
        <div data-flow-point="cIn" data-flow-to="eMid,fMid">
          c IN
        </div>
      </div>
      <div data-flow-step="2">
        <div data-flow-point="aMid">a MID</div>
        <div data-flow-point="bMid">b MID</div>
        <div data-flow-point="cMid" data-flow-to="aOut,bOut">
          c MID
        </div>
        <div data-flow-point="dMid">d MID</div>
        <div data-flow-point="eMid">e MID</div>
        <div data-flow-point="fMid" data-flow-to="bOut">
          f MID
        </div>
        <div data-flow-point="gMid" data-flow-to="bOut">
          g MID
        </div>
      </div>
      <div data-flow-step="3">
        <div data-flow-point="aOut">a OUT</div>
        <div data-flow-point="bOut">b OUT</div>
      </div>
    </div>
  );
};

render(<App />, document.getElementById('root'));
