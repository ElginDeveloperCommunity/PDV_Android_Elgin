import Foundation

@objc public class m8Plugin: NSObject {
    @objc public func echo(_ value: String) -> String {
        return value
    }
}
