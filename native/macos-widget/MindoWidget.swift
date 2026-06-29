import SwiftUI
import WidgetKit

struct MindoScene: Identifiable, Codable {
    let id: String
    let name: String
    let emoji: String
    let colorHex: String
}

struct MindoWidgetEntry: TimelineEntry {
    let date: Date
    let scenes: [MindoScene]
}

struct MindoProvider: TimelineProvider {
    func placeholder(in context: Context) -> MindoWidgetEntry {
        MindoWidgetEntry(date: Date(), scenes: [
            MindoScene(id: "scene-work", name: "Work", emoji: "💼", colorHex: "#0A84FF"),
            MindoScene(id: "scene-learning", name: "Learning", emoji: "💡", colorHex: "#FF9500")
        ])
    }

    func getSnapshot(in context: Context, completion: @escaping (MindoWidgetEntry) -> Void) {
        completion(placeholder(in: context))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<MindoWidgetEntry>) -> Void) {
        let entry = placeholder(in: context)
        completion(Timeline(entries: [entry], policy: .after(Date().addingTimeInterval(300))))
    }
}

struct SceneButton: View {
    let scene: MindoScene

    var body: some View {
        Link(destination: URL(string: "mindo://scene/\(scene.id)")!) {
            HStack {
                Text(scene.emoji)
                    .font(.title2)
                Text(scene.name)
                    .font(.headline)
                    .lineLimit(1)
                Spacer()
            }
            .padding(10)
            .background(.thinMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
        }
    }
}

struct MindoScenesWidgetView: View {
    var entry: MindoWidgetEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Mindo Scenes")
                .font(.headline)
            ForEach(entry.scenes.prefix(4)) { scene in
                SceneButton(scene: scene)
            }
        }
        .padding()
    }
}

struct MindoTimerWidgetView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Mindo Timer")
                .font(.headline)
            Link(destination: URL(string: "mindo://timer/free")!) {
                VStack(spacing: 6) {
                    Text("⏰")
                        .font(.largeTitle)
                    Text("Start / Stop")
                        .font(.headline)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(.thinMaterial)
                .clipShape(Circle())
            }
        }
        .padding()
    }
}

@main
struct MindoWidgetBundle: WidgetBundle {
    var body: some Widget {
        MindoScenesWidget()
        MindoTimerWidget()
    }
}

struct MindoScenesWidget: Widget {
    let kind = "MindoScenesWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: MindoProvider()) { entry in
            MindoScenesWidgetView(entry: entry)
        }
        .configurationDisplayName("Mindo Scenes")
        .description("Start scene check-ins or timers from the desktop.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct MindoTimerWidget: Widget {
    let kind = "MindoTimerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: MindoProvider()) { _ in
            MindoTimerWidgetView()
        }
        .configurationDisplayName("Mindo Timer")
        .description("Control the floating timer from the desktop.")
        .supportedFamilies([.systemSmall])
    }
}
